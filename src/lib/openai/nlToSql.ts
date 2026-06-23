import { openai, OPENAI_MODEL } from './client';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { nlToSqlOutputSchema } from '@/lib/validators/chat';
import { validateSql } from '@/lib/validators/sql';
import type { NlToSqlModelOutput } from '@/types/chat';

export class NlToSqlError extends Error {
  constructor(message: string, public readonly code: 'OPENAI_ERROR' | 'UNSAFE_SQL') {
    super(message);
    this.name = 'NlToSqlError';
  }
}

export interface NlToSqlResult extends NlToSqlModelOutput {
  /** SQL with the tenant placeholder swapped for a bound $1 parameter. */
  parameterizedSql: string;
}

/**
 * Turns a natural-language finance question into a validated, tenant-scoped,
 * parameterized SQL query. Never returns SQL that hasn't passed
 * validateSql() — callers can execute `parameterizedSql` directly with the
 * caller's userId as the single bound parameter.
 */
export async function generateSqlFromQuestion(question: string): Promise<NlToSqlResult> {
  const todayIso = new Date().toISOString().slice(0, 10);

  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(todayIso) },
        { role: 'user', content: buildUserPrompt(question) },
      ],
    });
  } catch (err) {
    throw new NlToSqlError(`OpenAI request failed: ${(err as Error).message}`, 'OPENAI_ERROR');
  }

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new NlToSqlError('OpenAI returned an empty response.', 'OPENAI_ERROR');
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new NlToSqlError('OpenAI response was not valid JSON.', 'OPENAI_ERROR');
  }

  const parseResult = nlToSqlOutputSchema.safeParse(parsedJson);
  if (!parseResult.success) {
    throw new NlToSqlError(
      `OpenAI response did not match the expected shape: ${parseResult.error.message}`,
      'OPENAI_ERROR',
    );
  }

  const modelOutput = parseResult.data;

  const validation = validateSql(modelOutput.sql);
  if (!validation.valid || !validation.parameterizedSql) {
    throw new NlToSqlError(validation.error ?? 'Generated SQL failed safety validation.', 'UNSAFE_SQL');
  }

  return {
    ...modelOutput,
    parameterizedSql: validation.parameterizedSql,
  };
}
