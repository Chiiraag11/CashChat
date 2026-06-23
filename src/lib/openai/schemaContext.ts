/**
 * Schema-aware context injected verbatim into the NL->SQL system prompt.
 * Kept in one place so that if prisma/schema.prisma changes, there's a
 * single source to update — and so the SQL validator's ALLOWED_TABLES /
 * ALLOWED_COLUMNS lists (lib/validators/sql.ts) stay traceable to this text.
 */
export const SCHEMA_CONTEXT = `
You may ONLY query these two tables. Do not reference any other table.

Table: accounts
  - id              text (primary key)
  - "userId"        text (foreign key -> the signed-in user; you never need
                     to filter on this directly — use the tenant scoping
                     rule below instead)
  - name            text   e.g. "Primary Checking"
  - type            text   one of: 'checking', 'savings'
  - balance         numeric

Table: transactions
  - id                text (primary key)
  - "accountId"       text (foreign key -> accounts.id)
  - amount            numeric   always a positive number; sign is implied by "type"
  - category          text      one of: 'Food', 'Transport', 'Entertainment',
                                 'Utilities', 'Shopping', 'Health', 'Income', 'Other'
  - merchant          text      e.g. 'Swiggy', 'Uber', 'Amazon', 'Netflix'
  - "transactionDate" timestamp
  - type              text      one of: 'debit' (expense) or 'credit' (income)
  - "createdAt"       timestamp

Relationship: transactions.accountId -> accounts.id (many transactions per account).
There is no direct userId column on transactions — you must join through accounts.

MANDATORY TENANT SCOPING RULE:
Every query you write MUST restrict results to the current user's own data.
Do this by including exactly this condition (verbatim, do not alter it) in
your WHERE clause, combined with AND if there are other conditions:

  "accountId" IN (SELECT id FROM accounts WHERE "userId" = :currentUserId)

Never attempt to filter by an actual user id value yourself — always use the
literal placeholder token ":currentUserId" exactly as shown above. The
application substitutes the real, authenticated user's id server-side.
`.trim();
