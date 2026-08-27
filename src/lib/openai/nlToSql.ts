import { gemini, GEMINI_MODEL } from './client';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { nlToSqlOutputSchema } from '@/lib/validators/chat';
import { validateSql } from '@/lib/validators/sql';
import type { NlToSqlModelOutput } from '@/types/chat';

export class NlToSqlError extends Error {
  constructor(
    message: string,
    public readonly code: 'AI_ERROR' | 'UNSAFE_SQL'
  ) {
    super(message);
    this.name = 'NlToSqlError';
  }
}

export interface NlToSqlResult extends NlToSqlModelOutput {
  parameterizedSql: string;
}

export async function generateSqlFromQuestion(
  question: string
): Promise<NlToSqlResult> {
  const todayIso = new Date().toISOString().slice(0, 10);

  let response;

  try {
    response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildUserPrompt(question),
      config: {
        systemInstruction: buildSystemPrompt(todayIso),
        responseMimeType: 'application/json',
      },
    });
  } catch (err) {
    throw new NlToSqlError(
      `Gemini request failed: ${(err as Error).message}`,
      'AI_ERROR'
    );
  }

  const raw = response.text;

  if (!raw) {
    throw new NlToSqlError(
      'Gemini returned an empty response.',
      'AI_ERROR'
    );
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new NlToSqlError(
      'Gemini response was not valid JSON.',
      'AI_ERROR'
    );
  }

  const parseResult = nlToSqlOutputSchema.safeParse(parsedJson);

  if (!parseResult.success) {
    throw new NlToSqlError(
      `Gemini response did not match the expected shape: ${parseResult.error.message}`,
      'AI_ERROR'
    );
  }

  const modelOutput = parseResult.data;

  const validation = validateSql(modelOutput.sql);

  if (!validation.valid || !validation.parameterizedSql) {
    throw new NlToSqlError(
      validation.error ?? 'Generated SQL failed safety validation.',
      'UNSAFE_SQL'
    );
  }

  return {
    ...modelOutput,
    parameterizedSql: validation.parameterizedSql,
  };
}