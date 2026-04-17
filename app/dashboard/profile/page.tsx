import DashboardLayout from '@/components/layout/DashboardLayout'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UserCircle } from 'lucide-react'

export default async function ProfilePage() {
  const user = await getUserProfile()
  if (!user || user.role !== 'user') redirect('/login')

  return (
    <DashboardLayout role="user">
       <div className="max-w-2xl mx-auto space-y-8">
         <header>
            <h1 className="text-3xl font-extrabold text-white mb-2">My Profile</h1>
            <p className="text-slate-400">Manage your account details and preferences.</p>
         </header>

         <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
               <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center">
                     <UserCircle size={48} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-white">{user.full_name || 'Valued Client'}</h2>
                     <p className="text-slate-400 font-mono mt-1 text-sm bg-black/40 inline-flex px-3 py-1 rounded-lg border border-white/5">
                        Client ID: {user.id.substring(0, 8).toUpperCase()}
                     </p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                     <div className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white">
                        {user.full_name || 'Not provided'}
                     </div>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                     <div className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white">
                        {user.phone || 'Not provided'}
                     </div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">City</label>
                     <div className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white">
                        {user.city || 'Not provided'}
                     </div>
                  </div>
               </div>

               <div className="pt-6 mt-6 border-t border-white/10">
                  <button className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                     Request Profile Update
                  </button>
               </div>
            </div>
         </div>
       </div>
    </DashboardLayout>
  )
}
