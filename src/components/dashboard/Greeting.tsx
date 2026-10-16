'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function partOfDay(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Greeting() {
  const { data: session } = useSession();
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);

  const first = session?.user?.name?.trim().split(/\s+/)[0];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
        {hour === null ? 'Welcome back' : partOfDay(hour)}
        {first ? <>, <span className="gradient-text">{first}</span></> : null}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
        Here&apos;s what&apos;s happening with your money.
      </p>
    </div>
  );
}
