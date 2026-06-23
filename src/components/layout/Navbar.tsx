'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="text-sm text-muted-foreground">
        {session?.user?.name ? `Welcome back, ${session.user.name}` : 'Welcome'}
      </div>
      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
        Sign out
      </Button>
    </header>
  );
}
