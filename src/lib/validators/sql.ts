/**
 * SQL Safety Layer
 * ---------------------------------------------------------------------------
 * Every query OpenAI generates passes through validateSql() before it ever
 * touches Postgres. This is defense-in-depth, not a substitute for least-
 * privilege DB credentials — the app's DB role should ALSO be read-only
 * (GRANT SELECT only) at the database level. See README "Security Model".
 *
 * What this validator guarantees:
 *   1. Exactly one statement (no `;`-separated stacked queries).
 *   2. No comments (a classic way to smuggle a second statement or hide
 *      a keyword from naive filters).
 *   3. Statement starts with SELECT or WITH — nothing else is ever allowed.
 *   4. No DML/DDL/admin keywords anywhere in the statement, matched on
 *      word boundaries so e.g. a merchant named "Updateville" isn't blocked.
 *   5. Only whitelisted tables/columns are referenced (prevents the model
 *      from querying tables it was never told about, e.g. `users`,
 *      `sessions`, `verification_tokens`).
 *   6. The mandatory tenant-scoping placeholder `:currentUserId` is present
 *      exactly once. This is what ties every generated query back to the
 *      authenticated user — see services/chat/chatService.ts for how the
 *      placeholder is swapped for a bound parameter (never string-
 *      concatenated) before execution.
 */

const ALLOWED_START_KEYWORDS = ['select', 'with'];

// Matched with \b word boundaries — see buildKeywordRegex().
const BLOCKED_KEYWORDS = [
  'delete',
  'update',
  'insert',
  'drop',
  'alter',
  'truncate',
  'grant',
  'revoke',
  'create',
  'replace',
  'merge',
  'call',
  'execute',
  'exec',
  'copy',
  'vacuum',
  'lock',
  'pg_sleep',
  'pg_read_file',
  'dblink',
  'into', // blocks `SELECT ... INTO new_table`
];

// Schema the LLM was given context on (see lib/openai/schemaContext.ts).
// Anything outside this whitelist is rejected even if it parses as valid SQL.
const ALLOWED_TABLES = ['transactions', 'accounts'];

const ALLOWED_COLUMNS = [
  'id',
  'accountid',
  'amount',
  'category',
  'merchant',
  'transactiondate',
  'type',
  'createdat',
  'userid',
  'name',
  'balance',
  // aggregate / SQL-construct tokens that legitimately appear in a SELECT list
  'sum',
  'count',
  'avg',
  'min',
  'max',
  'as',
  'total',
  'count_',
];

export interface SqlValidationResult {
  valid: boolean;
  error?: string;
  /** SQL with `:currentUserId` swapped for a bound `$1` placeholder, ready for $queryRawUnsafe. */
  parameterizedSql?: string;
}

const TENANT_PLACEHOLDER = ':currentUserId';

function buildKeywordRegex(keyword: string): RegExp {
  return new RegExp(`\\b${keyword}\\b`, 'i');
}

function stripStringLiterals(sql: string): string {
  // Replace contents of single-quoted string literals with spaces so that a
  // merchant name or category value can't accidentally trip keyword/table
  // checks (and can't be used to hide a blocked keyword either).
  return sql.replace(/'(?:[^'\\]|\\.)*'/g, "''");
}

const RESERVED_WORDS_NOT_ALIASES = new Set([
  'where', 'group', 'order', 'on', 'inner', 'left', 'right', 'outer', 'join',
  'union', 'limit', 'offset', 'having', 'and', 'or', 'set', 'select', 'with',
  'as', 'using',
]);

function extractTableReferences(sql: string): string[] {
  const tables: string[] = [];
  const regex = /\b(?:from|join)\s+"?([a-zA-Z_][a-zA-Z0-9_]*)"?/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    tables.push((match[1] ?? '').toLowerCase());
  }
  return tables;
}

/** CTE names introduced via `WITH name AS (` / `, name AS (` — these act as virtual tables. */
function extractCteNames(sql: string): string[] {
  const names: string[] = [];
  const regex = /\b(?:with|,)\s+"?([a-zA-Z_][a-zA-Z0-9_]*)"?\s+as\s*\(/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    names.push((match[1] ?? '').toLowerCase());
  }
  return names;
}

/** Table aliases, e.g. `transactions t` or `transactions AS t` -> "t". */
function extractTableAliases(sql: string): string[] {
  const aliases: string[] = [];
  const regex = /\b(?:from|join)\s+"?[a-zA-Z_][a-zA-Z0-9_]*"?\s+(?:as\s+)?"?([a-zA-Z_][a-zA-Z0-9_]*)"?/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    const candidate = (match[1] ?? '').toLowerCase();
    if (!RESERVED_WORDS_NOT_ALIASES.has(candidate)) {
      aliases.push(candidate);
    }
  }
  return aliases;
}

/** Column/result aliases introduced via `<expr> AS name` — these are names the query defines, not schema references. */
function extractAsAliases(sql: string): string[] {
  const aliases: string[] = [];
  const regex = /\bas\s+"?([a-zA-Z_][a-zA-Z0-9_]*)"?/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    aliases.push((match[1] ?? '').toLowerCase());
  }
  return aliases;
}

export function validateSql(rawSql: string): SqlValidationResult {
  if (!rawSql || typeof rawSql !== 'string') {
    return { valid: false, error: 'SQL must be a non-empty string.' };
  }

  let sql = rawSql.trim();

  // --- 2. No comments allowed, anywhere ---
  if (sql.includes('--') || sql.includes('/*') || sql.includes('*/')) {
    return { valid: false, error: 'SQL comments are not allowed.' };
  }

  // --- 1. Exactly one statement ---
  // Allow a single optional trailing semicolon; reject anything after it.
  const withoutTrailingSemicolon = sql.replace(/;\s*$/, '');
  if (withoutTrailingSemicolon.includes(';')) {
    return { valid: false, error: 'Multiple SQL statements are not allowed.' };
  }
  sql = withoutTrailingSemicolon.trim();

  if (sql.length === 0) {
    return { valid: false, error: 'SQL must be a non-empty string.' };
  }

  // --- 3. Must start with SELECT or WITH ---
  const firstWord = (sql.split(/\s+/)[0] ?? '').toLowerCase().replace(/[^a-z]/g, '');
  if (!ALLOWED_START_KEYWORDS.includes(firstWord)) {
    return { valid: false, error: `Statement must start with SELECT or WITH, got "${firstWord}".` };
  }

  const sqlForKeywordScan = stripStringLiterals(sql);

  // --- 4. Blocked keywords ---
  for (const keyword of BLOCKED_KEYWORDS) {
    if (buildKeywordRegex(keyword).test(sqlForKeywordScan)) {
      return { valid: false, error: `Blocked keyword detected: "${keyword}".` };
    }
  }

  // --- 5a. Table whitelist (CTE names count as virtual tables) ---
  const cteNames = extractCteNames(sqlForKeywordScan);
  const referencedTables = extractTableReferences(sqlForKeywordScan);
  if (referencedTables.length === 0) {
    return { valid: false, error: 'Could not determine any table reference (FROM/JOIN) in the query.' };
  }
  for (const table of referencedTables) {
    if (!ALLOWED_TABLES.includes(table) && !cteNames.includes(table)) {
      return { valid: false, error: `Table "${table}" is not part of the allowed schema.` };
    }
  }

  // --- 5b. Column whitelist (best-effort identifier scan) ---
  // We scan bare identifiers, not a full SQL parse — good enough to catch a
  // model hallucinating a column/table that doesn't exist in our schema,
  // without the cost/complexity of a real SQL AST parser for this layer.
  // Table aliases ("t" in "transactions t"), CTE names, and result aliases
  // ("AS total") are names the query *defines* rather than schema
  // references, so they're collected up front and exempted from the check.
  const tableAliases = extractTableAliases(sqlForKeywordScan);
  const asAliases = extractAsAliases(sqlForKeywordScan);

  const identifierRegex = /"?([a-zA-Z_][a-zA-Z0-9_]*)"?\s*(?:\.\s*"?([a-zA-Z_][a-zA-Z0-9_]*)"?)?/g;
  const sqlAfterKeywords = sqlForKeywordScan.toLowerCase();
  let idMatch: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((idMatch = identifierRegex.exec(sqlAfterKeywords)) !== null) {
    const candidate = (idMatch[2] ?? idMatch[1] ?? '').toLowerCase();
    seen.add(candidate);
  }
  // Remove SQL keywords / schema-defined names / query-defined aliases from
  // the identifier set so only genuine "column-shaped" leftovers get
  // checked against ALLOWED_COLUMNS.
  const SQL_NOISE = new Set([
    'select', 'with', 'from', 'join', 'where', 'and', 'or', 'group', 'by', 'order',
    'limit', 'offset', 'on', 'in', 'is', 'not', 'null', 'between', 'like', 'desc', 'asc',
    'distinct', 'having', 'date_trunc', 'extract', 'cast', 'coalesce', 'case', 'when',
    'then', 'else', 'end', 'inner', 'left', 'right', 'outer', 'currentuserid', 'now',
    'interval', 'month', 'year', 'day', 'as', 'true', 'false',
    ...ALLOWED_TABLES, ...cteNames, ...tableAliases, ...asAliases,
  ]);
  for (const id of seen) {
    if (id === '' || SQL_NOISE.has(id) || /^\d+$/.test(id)) continue;
    if (!ALLOWED_COLUMNS.includes(id)) {
      return { valid: false, error: `Column or identifier "${id}" is not part of the allowed schema.` };
    }
  }

  // --- 6. Mandatory tenant scoping placeholder ---
  const placeholderOccurrences = sql.split(TENANT_PLACEHOLDER).length - 1;
  if (placeholderOccurrences === 0) {
    return {
      valid: false,
      error: 'Query is missing required tenant scoping (:currentUserId). Refusing to execute unscoped query.',
    };
  }

  // Swap the placeholder for a bound parameter. We never string-concatenate
  // the actual userId into the SQL string — Prisma binds $1 separately.
  const parameterizedSql = sql.split(TENANT_PLACEHOLDER).join('$1');

  return { valid: true, parameterizedSql };
}
