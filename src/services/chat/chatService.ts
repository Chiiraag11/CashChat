import { prisma } from '@/lib/prisma';
import { generateSqlFromQuestion, NlToSqlError } from '@/lib/openai/nlToSql';
import { getCachedChatResult, setCachedChatResult } from '@/lib/redis';
import { hashQuestion } from '@/lib/utils';
import type { ChatApiResponse, ChartDatum, QueryRow } from '@/types/chat';

export class ChatServiceError extends Error {
  constructor(message: string, public readonly code: 'OPENAI_ERROR' | 'UNSAFE_SQL' | 'DB_ERROR') {
    super(message);
    this.name = 'ChatServiceError';
  }
}

/**
 * End-to-end flow for one chat question:
 *   Redis cache check -> [miss] -> NL->SQL (OpenAI + validateSql) ->
 *   parameterized execution (userId bound, never concatenated) ->
 *   chart-data shaping -> cache write -> response.
 */
export async function answerFinanceQuestion(userId: string, question: string): Promise<ChatApiResponse> {
  const cacheKey = hashQuestion(userId, question);

  const cached = await getCachedChatResult(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  let sqlResult;
  try {
    sqlResult = await generateSqlFromQuestion(question);
  } catch (err) {
    if (err instanceof NlToSqlError) {
      throw new ChatServiceError(err.message, err.code);
    }
    throw err;
  }

  let rawRows: Record<string, unknown>[];
  try {
    rawRows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(sqlResult.parameterizedSql, userId);
  } catch (err) {
    throw new ChatServiceError(`Failed to execute generated query: ${(err as Error).message}`, 'DB_ERROR');
  }

  const rows = serializeRows(rawRows);
  const chartData = sqlResult.chartType === 'none' ? null : buildChartData(rows);

  const response: ChatApiResponse = {
    question,
    sql: sqlResult.sql,
    explanation: sqlResult.explanation,
    chartType: sqlResult.chartType,
    rows,
    chartData,
    cached: false,
    generatedAt: new Date().toISOString(),
  };

  await setCachedChatResult(cacheKey, response);

  return response;
}

/**
 * $queryRawUnsafe returns driver-level values (Decimal-like objects for
 * numeric columns, Date for timestamps, bigint for counts, etc.) — none of
 * which are valid JSON as-is. This normalizes every value down to the
 * string | number | null shape QueryRow promises before it ever reaches
 * JSON.stringify (the Redis cache write and the API response).
 */
function serializeRows(rows: Record<string, unknown>[]): QueryRow[] {
  return rows.map((row) => {
    const out: QueryRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === null || value === undefined) {
        out[key] = null;
      } else if (typeof value === 'number' || typeof value === 'string') {
        out[key] = value;
      } else if (typeof value === 'bigint') {
        out[key] = Number(value);
      } else if (value instanceof Date) {
        out[key] = value.toISOString();
      } else if (typeof value === 'object') {
        // Decimal / other driver wrapper objects implement toString().
        const asString = String(value);
        const asNumber = Number(asString);
        out[key] = Number.isNaN(asNumber) ? asString : asNumber;
      } else {
        out[key] = String(value);
      }
    }
    return out;
  });
}

/**
 * Heuristically maps arbitrary query result rows to {label, value} pairs for
 * Recharts: the first string-ish column becomes the label, the first
 * numeric column becomes the value. Good enough for the bounded set of
 * group-by shapes our few-shot examples teach the model to produce.
 */
function buildChartData(rows: QueryRow[]): ChartDatum[] | null {
  const sample = rows[0];
  if (!sample) return null;

  const keys = Object.keys(sample);
  const fallbackKey = keys[0];
  if (!fallbackKey) return null;

  const labelKey = keys.find((k) => typeof sample[k] === 'string') ?? fallbackKey;
  const valueKey = keys.find((k) => typeof sample[k] === 'number' && k !== labelKey);

  if (!valueKey) return null;

  return rows.map((row) => ({
    label: String(row[labelKey] ?? 'Unknown'),
    value: Number(row[valueKey]) || 0,
  }));
}
