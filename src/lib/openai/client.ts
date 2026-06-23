import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  // Fail fast at boot rather than on the first chat request.
  console.warn('OPENAI_API_KEY is not set — /api/chat will fail until it is configured.');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_MODEL = 'gpt-4o-mini';
