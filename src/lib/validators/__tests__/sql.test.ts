import { describe, it, expect } from 'vitest';
import { validateSql } from '../sql';

const VALID_BASE = `SELECT SUM(t.amount) AS total
FROM transactions t
WHERE t.category = 'Food'
  AND t.type = 'debit'
  AND t."accountId" IN (SELECT id FROM accounts WHERE "userId" = :currentUserId)`;

describe('validateSql', () => {
  it('accepts a well-formed, tenant-scoped SELECT', () => {
    const result = validateSql(VALID_BASE);
    expect(result.valid).toBe(true);
    expect(result.parameterizedSql).toContain('$1');
    expect(result.parameterizedSql).not.toContain(':currentUserId');
  });

  it('accepts WITH (CTE) statements', () => {
    const sql = `WITH scoped AS (
      SELECT * FROM transactions t WHERE t."accountId" IN (SELECT id FROM accounts WHERE "userId" = :currentUserId)
    )
    SELECT category, SUM(amount) AS total FROM scoped GROUP BY category`;
    expect(validateSql(sql).valid).toBe(true);
  });

  it('rejects DELETE statements', () => {
    const result = validateSql(`DELETE FROM transactions WHERE "accountId" IN (SELECT id FROM accounts WHERE "userId" = :currentUserId)`);
    expect(result.valid).toBe(false);
  });

  it('rejects DROP TABLE smuggled via a stacked statement', () => {
    const result = validateSql(`${VALID_BASE}; DROP TABLE transactions;`);
    expect(result.valid).toBe(false);
  });

  it('rejects SQL comments used to hide a second statement', () => {
    const result = validateSql(`${VALID_BASE} -- ; DROP TABLE transactions;`);
    expect(result.valid).toBe(false);
  });

  it('rejects queries missing the tenant scoping placeholder', () => {
    const result = validateSql(`SELECT SUM(amount) AS total FROM transactions WHERE category = 'Food'`);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/tenant scoping/i);
  });

  it('rejects references to tables outside the whitelist', () => {
    const result = validateSql(
      `SELECT * FROM users WHERE "accountId" IN (SELECT id FROM accounts WHERE "userId" = :currentUserId)`,
    );
    expect(result.valid).toBe(false);
  });

  it('rejects statements that do not start with SELECT or WITH', () => {
    const result = validateSql(`UPDATE transactions SET amount = 0`);
    expect(result.valid).toBe(false);
  });

  it('rejects a dangerous keyword disguised inside a string literal check bypass attempt', () => {
    // The keyword scan strips string literal contents first, so a merchant
    // name like 'DROP everything' must NOT be flagged — only real keywords.
    const sql = `SELECT * FROM transactions t WHERE t.merchant = 'DROP everything' AND t."accountId" IN (SELECT id FROM accounts WHERE "userId" = :currentUserId)`;
    expect(validateSql(sql).valid).toBe(true);
  });

  it('rejects multiple statements separated by semicolons even without trailing one', () => {
    const result = validateSql(`SELECT 1; SELECT 2`);
    expect(result.valid).toBe(false);
  });
});
