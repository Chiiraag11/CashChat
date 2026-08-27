/** Shared types for the NL->SQL chat pipeline (server + client). */

export type ChartType = 'bar' | 'line' | 'pie' | 'none';

/** Raw shape OpenAI is instructed to return (see lib/openai/prompt.ts). */
export interface NlToSqlModelOutput {
  sql: string;
  explanation: string;
  chartType: ChartType;
}

/** A single generic row coming back from the executed SQL query. */
export type QueryRow = Record<string, string | number | null>;

/** Final payload returned by POST /api/chat and rendered by the Chat UI. */
export interface ChatApiResponse {
  question: string;
  sql: string;
  explanation: string;
  chartType: ChartType;
  rows: QueryRow[];
  chartData: ChartDatum[] | null;
  cached: boolean;
  generatedAt: string; // ISO timestamp
}

export interface ChartDatum {
  label: string;
  value: number;
}

export interface ChatErrorResponse {
  error: string;
  code: 'VALIDATION_ERROR' | 'UNSAFE_SQL' | 'OPENAI_ERROR' | 'DB_ERROR' | 'UNAUTHORIZED';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  result?: ChatApiResponse;
  error?: string;
  createdAt: string;
}
