import { getUserProfile } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Bell, Search, Filter, MoreHorizontal, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const user = await getUserProfile()
  const supabase = await createClient()

  if (!user) {
    redirect('/login')
  }

  // Redirect based on role
  if (user.role === 'co_admin') {
    redirect('/co-admin')
  }
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch lead stats
  const { count: newLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  const { count: clientsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')

  const { count: requestsCount } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'completed')

  const { count: staffCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'staff')

  const { count: referralsCount } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })

  // Fetch latest leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch clients
  const { data: clients } = await supabase
    .from('profiles')
    .select('id, full_name, phone, city')
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  const initialData = {
    counts: {
      leads: newLeadsCount || 0,
      clients: clientsCount || 0,
      requests: requestsCount || 0,
      staff: staffCount || 0,
      referrals: referralsCount || 0
    },
    leads: leads || [],
    clients: clients || []
  }

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

        <AdminClient initialData={initialData} />
      </div>
    </DashboardLayout>
  )
}
