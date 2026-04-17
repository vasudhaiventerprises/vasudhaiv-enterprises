import DashboardLayout from '@/components/layout/DashboardLayout'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { 
  User, Phone, MapPin, Calendar, Wrench, FileText, 
  Share2, ArrowLeft, PlusCircle, CheckCircle2, Clock, Activity 
} from 'lucide-react'
import Link from 'next/link'

export default async function ClientDetailPage({ params }: { params: { clientId: string } }) {
  const supabase = await createClient()
  
  // 1. Fetch Client Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.clientId)
    .single()

  if (!profile) redirect('/admin')

  // 2. Fetch Core Data
  const [
    { data: installation },
    { data: requests },
    { data: notes },
    { data: referrals }
  ] = await Promise.all([
    supabase.from('installations').select('*').eq('client_id', params.clientId).single(),
    supabase.from('service_requests').select('*, assigned:profiles!assigned_staff(full_name)').eq('client_id', params.clientId).order('created_at', { ascending: false }),
    supabase.from('client_notes').select('*, admin:profiles!admin_id(full_name)').eq('client_id', params.clientId).order('created_at', { ascending: false }),
    supabase.from('referrals').select('*, lead:leads!lead_id(full_name, phone)').eq('referrer_id', params.clientId)
  ])

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
               <span className="font-bold">Back to Dashboard</span>
            </Link>
            <div className="flex gap-3">
               <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all">Edit Profile</button>
               <a href={`tel:${profile.phone}`} className="px-5 py-2.5 bg-emerald-500 text-black font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2">
                  <Phone size={16} /> Call Client
               </a>
            </div>
        </div>

        {/* Top Grid: Profile & Installation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <User size={120} />
               </div>
               <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6 text-primary-400">
                  <User size={32} />
               </div>
               <h1 className="text-3xl font-black text-white mb-2">{profile.full_name}</h1>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">Client since {new Date(profile.created_at).getFullYear()}</p>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300">
                     <Phone size={16} className="text-slate-500" />
                     <span className="text-sm">{profile.phone || 'No phone provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                     <MapPin size={16} className="text-slate-500" />
                     <span className="text-sm">{profile.city || 'Allahabad'}</span>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Status</p>
                     <p className="text-white font-black">Active Client</p>
                  </div>
               </div>
            </div>

            {/* Installation Card */}
            <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-8">
                     <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Activity className="text-primary-400" size={20} />
                        System Specification
                     </h3>
                     {installation && <span className="bg-primary-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Live</span>}
                  </div>

                  {installation ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capacity</p>
                          <p className="text-2xl font-black text-white">{installation.system_size_kw} <span className="text-sm text-slate-600">kW</span></p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Install Date</p>
                          <p className="text-lg font-bold text-white">{new Date(installation.install_date).toLocaleDateString()}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Warranty</p>
                          <p className="text-lg font-bold text-emerald-400">{new Date(installation.warranty_expiry).getFullYear()}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AMC Expiry</p>
                          <p className={`text-lg font-bold ${new Date(installation.amc_expiry) < new Date() ? 'text-red-500' : 'text-primary-400'}`}>
                             {new Date(installation.amc_expiry).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </p>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                       No installation record found.
                    </div>
                  )}
               </div>
               
               {installation && (
                  <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 overflow-x-auto pb-2">
                     <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
                        <MapPin size={14} className="text-slate-500" />
                        <span className="text-xs text-slate-400">{installation.address || 'Address pending'}</span>
                     </div>
                  </div>
               )}
            </div>
        </div>

        {/* Bottom Tabs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           {/* Service History Timeline */}
           <div className="lg:col-span-8 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 ml-4">
                 <Wrench className="text-blue-400" size={20} />
                 Service History
              </h3>
              
              <div className="space-y-4">
                 {requests && requests.length > 0 ? requests.map((req: any) => (
                    <div key={req.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h4 className="font-bold text-white mb-1">{req.issue_type}</h4>
                             <p className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                             req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                             req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                             {req.status}
                          </span>
                       </div>
                       <p className="text-sm text-slate-400 leading-relaxed mb-4">{req.description}</p>
                       {(req.assigned || req.completion_note) && (
                          <div className="bg-black/20 rounded-2xl p-4 flex gap-6">
                             {req.assigned && (
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Technician</p>
                                   <p className="text-xs text-blue-400 font-bold">{req.assigned.full_name}</p>
                                </div>
                             )}
                             {req.completion_note && (
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Completion Note</p>
                                   <p className="text-xs text-emerald-400 italic">"{req.completion_note}"</p>
                                </div>
                             )}
                          </div>
                       )}
                    </div>
                 )) : (
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-10 text-center italic text-slate-600">No service tickets recorded.</div>
                 )}
              </div>
           </div>

           {/* Sidebar: Notes & Referrals */}
           <div className="lg:col-span-4 space-y-8">
              {/* Notes Section */}
              <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-white flex items-center gap-2">
                       <FileText className="text-indigo-400" size={18} />
                       Admin Notes
                    </h4>
                    <button className="text-slate-500 hover:text-white transition-colors"><PlusCircle size={20}/></button>
                 </div>
                 <div className="space-y-4">
                    {notes && notes.length > 0 ? notes.map((note: any) => (
                       <div key={note.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-xs text-slate-300 leading-relaxed mb-2">{note.note}</p>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] text-indigo-400 font-bold">@{note.admin?.full_name || 'Admin'}</span>
                             <span className="text-[10px] text-slate-600 uppercase">{new Date(note.created_at).toLocaleDateString()}</span>
                          </div>
                       </div>
                    )) : (
                       <p className="text-xs text-slate-600 italic">No internal notes yet.</p>
                    )}
                 </div>
              </div>

              {/* Referrals Section */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
                 <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Share2 className="text-primary-400" size={18} />
                    Referrals Made
                 </h4>
                 <div className="space-y-4">
                    {referrals && referrals.length > 0 ? referrals.map((ref: any) => (
                       <div key={ref.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                          <div>
                             <p className="text-xs font-bold text-white">{ref.lead?.full_name}</p>
                             <p className="text-[10px] text-slate-500 uppercase">{ref.status}</p>
                          </div>
                          <span className={`text-[10px] font-black ${ref.reward_paid ? 'text-emerald-500' : 'text-amber-500'}`}>
                             {ref.reward_paid ? 'REWARDED' : 'PENDING'}
                          </span>
                       </div>
                    )) : (
                       <p className="text-xs text-slate-600 italic">Hasn't referred anyone yet.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
