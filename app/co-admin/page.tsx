import DashboardLayout from '@/components/layout/DashboardLayout'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import CoAdminClient from './CoAdminClient'
import { getUserProfile } from '@/lib/auth'

export default async function CoAdminPage() {
  const user = await getUserProfile()
  if (!user || user.role !== 'co_admin') redirect('/login')

  const supabase = await createClient()

  const [
    { data: leads },
    { data: clients },
    { data: requests }
  ] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('profiles').select('*').eq('role', 'user').limit(50),
    supabase.from('service_requests').select('*, client:profiles!client_id(full_name)').order('created_at', { ascending: false }).limit(20)
  ])

  return (
    <DashboardLayout role="co_admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-white mb-2">Operation Portal</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Co-Administrator Access Level</p>
        </header>

        <CoAdminClient initialData={{ leads, clients, requests }} />
      </div>
    </DashboardLayout>
  )
}
