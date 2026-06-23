'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">FinChat</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ask your money anything.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex w-full items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Continue with Google
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree this is a demo app — don&apos;t connect real financial accounts.
        </p>
      </div>
    </main>
  );
}
