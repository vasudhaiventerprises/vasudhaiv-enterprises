import DashboardLayout from '@/components/layout/DashboardLayout'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ServiceRequestClient from '../ServiceRequestClient'

export default async function ServiceRequestsPage() {
  const user = await getUserProfile()
  if (!user || user.role !== 'user') redirect('/login')

  const supabase = await createClient()

  const { data: initialRequests } = await supabase
    .from('service_requests')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout role="user">
       <div className="max-w-4xl mx-auto space-y-8">
         <header>
            <h1 className="text-3xl font-extrabold text-white mb-2">Service Tickets</h1>
            <p className="text-slate-400">Manage your AMC maintenance and repair requests.</p>
         </header>

         <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
            <ServiceRequestClient userId={user.id} initialRequests={initialRequests || []} />
         </div>
       </div>
    </DashboardLayout>
  )
}
