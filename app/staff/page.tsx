import { getUserProfile } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Wrench, Phone, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import JobActions from '@/components/staff/JobActions'

export default async function StaffDashboard() {
  const user = await getUserProfile()

  if (!user) {
    redirect('/login')
  }

  // Redirect if they are logged in but NOT staff
  if (user.role !== 'staff' && user.role !== 'admin') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch jobs assigned to this staff member
  const { data: myJobs } = await supabase
    .from('service_requests')
    .select(`
      id, issue_type, description, status, preferred_date, created_at,
      profiles ( full_name, phone, city ),
      installations ( address )
    `)
    .eq('assigned_staff', user.id)
    .neq('status', 'completed')
    .order('created_at', { ascending: false })

  // Fetch unassigned jobs
  const { data: openJobs } = await supabase
    .from('service_requests')
    .select(`
      id, issue_type, description, status, preferred_date, created_at,
      profiles ( full_name, city )
    `)
    .is('assigned_staff', null)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout role={user.role}>
      <div className="max-w-4xl mx-auto pb-12">
        <header className="mb-8">
          <p className="text-primary-400 font-bold mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="text-3xl font-extrabold text-white mb-2">Staff Portal</h1>
          <p className="text-slate-400">Welcome, {user.full_name}. Here are your service routes.</p>
        </header>

        {/* My Jobs Today */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Clock className="text-amber-400" size={18}/>
             My Assigned Jobs
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
             {myJobs && myJobs.length > 0 ? myJobs.map((job: any) => (
                <div key={job.id} className="bg-white/5 border border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)] p-6 rounded-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-bl-xl border-b border-l border-amber-500/20">
                      Action Required
                   </div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-start gap-6 mt-4 md:mt-0">
                      <div>
                         <h3 className="text-xl font-bold text-white mb-1">{job.issue_type}</h3>
                         <p className="text-sm text-slate-400 mb-4">{job.description}</p>
                         
                         <div className="grid gap-2 text-xs text-slate-300">
                            <p className="flex items-center gap-2">
                               <UserIcon size={14} className="text-slate-500"/> 
                               <span className="font-bold text-slate-200">{job.profiles?.full_name}</span>
                            </p>
                            <p className="flex items-center gap-2">
                               <MapPin size={14} className="text-slate-500"/> 
                               {job.installations?.address || job.profiles?.city || 'Address details pending...'} 
                            </p>
                            <p className="flex items-center gap-2">
                               <Phone size={14} className="text-slate-500"/> 
                               {job.profiles?.phone} 
                            </p>
                            <p className="flex items-center gap-2">
                               <Calendar size={14} className="text-slate-500"/> 
                               Preferred Date: <span className="text-primary-400">{job.preferred_date ? new Date(job.preferred_date).toLocaleDateString() : 'ASAP'}</span>
                            </p>
                         </div>
                      </div>
                      
                      <div className="w-full md:w-auto flex flex-col gap-3">
                         <a href={`tel:${job.profiles?.phone}`} className="flex-1 text-center py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10">
                            📞 Call Client
                         </a>
                         <JobActions jobId={job.id} type="complete" />
                      </div>
                   </div>
                </div>
             )) : (
                <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center">
                   <div className="mx-auto w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                      <CheckCircle2 size={24}/>
                   </div>
                   <p className="font-bold text-white text-lg">Clear Schedule!</p>
                   <p className="text-slate-400 text-sm mt-1">You have no active assignments. Grab an open job below.</p>
                </div>
             )}
          </div>
        </section>

        {/* Open/Unassigned Jobs Pool */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Wrench className="text-primary-400" size={18}/>
             Available Jobs Queue
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max">
                   <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Task</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Location</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {openJobs && openJobs.length > 0 ? openJobs.map((openJob: any) => (
                         <tr key={openJob.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                               <p className="font-bold text-white">{openJob.issue_type}</p>
                               <p className="text-[10px] text-slate-400 mt-1">Requested {new Date(openJob.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300">
                               {openJob.profiles?.city}
                            </td>
                             <td className="px-6 py-4">
                                <JobActions jobId={openJob.id} staffId={user.id} type="take" />
                             </td>
                         </tr>
                      )) : (
                         <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-500 italic">No available jobs in the pool right now.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}

function UserIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
