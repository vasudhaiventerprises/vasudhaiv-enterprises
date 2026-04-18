import { getUserProfile } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ServiceRequestClient from './ServiceRequestClient'
import ReferralWidget from '@/components/dashboard/ReferralWidget'
import InstallationStatus from '@/components/dashboard/InstallationStatus'

export default async function ClientDashboard() {
  const user = await getUserProfile()

  if (!user) {
    redirect('/login')
  }

  // Auto-redirect if they are not a standard user
  if (user.role === 'admin') {
    redirect('/admin')
  }
  if (user.role === 'staff') {
    redirect('/staff')
  }
  if (user.role === 'co_admin') {
    redirect('/co-admin')
  }

  const supabase = await createClient()

  // Fetch initial service requests
  const { data: initialRequests } = await supabase
    .from('service_requests')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  // Ensure user has a referral code
  let referralCode = user.referral_code
  if (!referralCode) {
    const newCode = `VASU${user.id.substring(0, 4).toUpperCase()}`
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referral_code: newCode })
      .eq('id', user.id)
    if (!updateError) {
      referralCode = newCode
    }
  }

  // Fetch true referral stats
  const { data: referrals } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)
  
  const referredCount = referrals?.length || 0
  const convertedCount = referrals?.filter((r) => r.status === 'converted' || r.status === 'rewarded').length || 0
  const totalRewards = referrals?.filter((r) => r.status === 'rewarded').reduce((sum, r) => sum + Number(r.reward_amount), 0) || 0

  // Fetch installation details
  const { data: installation } = await supabase
    .from('installations')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle()

  return (
    <DashboardLayout role="user">
      <div className="max-w-4xl mx-auto pb-12">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Hello, {user.full_name || 'Valued Client'} 👋</h1>
          <p className="text-slate-400">Welcome to your solar energy command center.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Live Generation</p>
            <p className="text-3xl font-black text-emerald-400">4.2 kW</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Savings</p>
            <p className="text-3xl font-black text-amber-400">₹8,450</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">CO2 Offset</p>
            <p className="text-3xl font-black text-blue-400">124 kg</p>
          </div>
        </div>

        <InstallationStatus 
          systemSizeKw={installation?.system_size_kw}
          installDate={installation?.install_date}
          warrantyExpiry={installation?.warranty_expiry}
          amcExpiry={installation?.amc_expiry}
        />

        <ServiceRequestClient userId={user.id} initialRequests={initialRequests || []} />

        <ReferralWidget 
          referralCode={referralCode || ''}
          referredCount={referredCount}
          convertedCount={convertedCount}
          totalRewards={totalRewards}
        />
      </div>
    </DashboardLayout>
  )
}

