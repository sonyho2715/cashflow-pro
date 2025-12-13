import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDashboardStats, getRecentActivity } from '@/app/actions/business';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  const [statsResult, activityResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
  ]);

  return (
    <DashboardClient
      user={{
        name: session.name,
        email: session.email,
        plan: session.plan,
      }}
      initialStats={statsResult.data}
      initialActivities={activityResult.data || []}
    />
  );
}
