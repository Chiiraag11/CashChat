import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/** Landing route: signed-in users go to the dashboard, everyone else to login. */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  redirect(session ? '/dashboard' : '/login');
}
