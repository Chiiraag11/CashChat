import { NextRequest, NextResponse } from 'next/server';
import { requireUserId, UnauthorizedError } from '@/lib/session';
import { chatRequestSchema } from '@/lib/validators/chat';
import { answerFinanceQuestion, ChatServiceError } from '@/services/chat/chatService';
import type { ChatErrorResponse } from '@/types/chat';

export const runtime = 'nodejs';

/**
 * POST /api/chat
 * Request:  { "question": string }
 * Response: ChatApiResponse (see src/types/chat.ts) on 200,
 *           ChatErrorResponse on 4xx/5xx.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();

    const body = await req.json().catch(() => null);
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Invalid request body.', 400);
    }

    const result = await answerFinanceQuestion(userId, parsed.data.question);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return errorResponse('UNAUTHORIZED', 'You must be signed in to use the chat assistant.', 401);
    }
    if (err instanceof ChatServiceError) {
      const status = err.code === 'DB_ERROR' ? 500 : 422;
      return errorResponse(err.code, err.message, status);
    }
    console.error('Unhandled /api/chat error:', err);
    return errorResponse('OPENAI_ERROR', 'Something went wrong answering your question. Please try again.', 500);
  }
}

function errorResponse(code: ChatErrorResponse['code'], message: string, status: number) {
  return NextResponse.json<ChatErrorResponse>({ error: message, code }, { status });
}
