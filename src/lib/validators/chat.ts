import { z } from 'zod';

/** POST /api/chat request body */
export const chatRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, 'Question is too short.')
    .max(500, 'Question is too long (max 500 characters).'),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

/** Shape enforced on OpenAI's JSON response before we trust it at all. */
export const nlToSqlOutputSchema = z.object({
  sql: z.string().min(1),
  explanation: z.string().min(1),
  chartType: z.enum(['bar', 'line', 'pie', 'none']),
});

/** Dashboard query-string params shared by several routes. */
export const dateRangeQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
