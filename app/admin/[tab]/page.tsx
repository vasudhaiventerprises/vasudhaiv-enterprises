import { getUserProfile } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Bell } from 'lucide-react'
import AdminClient from '../AdminClient'

export default async function AdminTabContent({ params }: { params: { tab: string } }) {
  const user = await getUserProfile()
  const supabase = await createClient()

  if (!user) {
    redirect('/login')
  }

  if (user.role === 'co_admin') {
    redirect('/co-admin')
  }
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  // Map the URL path slug to the correct Tab string in AdminClient
  const tabMap: Record<string, string> = {
     'leads': 'Leads',
     'service': 'Service Requests',
     'notifications': 'Notifications',
     'clients': 'Clients',
     'staff': 'Staff',
     'referrals': 'Referrals',
     'analytics': 'Analytics'
  }

  const { tab } = await params;
  const initialTab = tabMap[tab] || 'Overview'

  // Fetch data with error handling to prevent page crashes
  const safeGetCount = async (table: string, filter?: (q: any) => any) => {
    try {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) query = filter(query);
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.error(`Error fetching count for ${table}:`, e);
      return 0;
    }
  };

  const [newLeadsCount, clientsCount, requestsCount, staffCount, referralsCount] = await Promise.all([
    safeGetCount('leads'),
    safeGetCount('profiles', (q) => q.eq('role', 'user')),
    safeGetCount('service_requests', (q) => q.neq('status', 'completed')),
    safeGetCount('profiles', (q) => q.eq('role', 'staff')),
    safeGetCount('referrals')
  ]);

  // Fetch latest leads and clients with safety
  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(50);
  const { data: clients } = await supabase.from('profiles').select('id, full_name, phone, city').eq('role', 'user').order('created_at', { ascending: false }).limit(50);

  const initialData = {
    counts: {
      leads: newLeadsCount,
      clients: clientsCount,
      requests: requestsCount,
      staff: staffCount,
      referrals: referralsCount
    },
    leads: leads || [],
    clients: clients || []
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Admin Command Center</h1>
            <p className="text-slate-400">Welcome back, {user.full_name || 'Admin'}. Here is your operations overview.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-5 py-2.5 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 text-sm">
                <Bell size={16} />
                Global Alert
             </button>
          </div>
        </header>

        <AdminClient initialData={initialData} initialTab={initialTab} />
      </div>
    </DashboardLayout>
  )
}
