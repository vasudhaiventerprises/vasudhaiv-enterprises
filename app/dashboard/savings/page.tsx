import DashboardLayout from '@/components/layout/DashboardLayout'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CheckCircle2, Factory, Leaf, Zap, BarChart3, PlusCircle } from 'lucide-react'
import SavingsChart from '@/components/dashboard/SavingsChart'

export default async function SavingsPage() {
  const user = await getUserProfile()
  if (!user || user.role !== 'user') redirect('/login')

  return (
    <DashboardLayout role="user">
       <div className="max-w-4xl mx-auto space-y-8">
         <header>
            <h1 className="text-3xl font-extrabold text-white mb-2">Energy & Savings</h1>
            <p className="text-slate-400">Detailed analytics of your solar generation and financial returns.</p>
         </header>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
               <Zap className="text-emerald-400 mb-4" size={24} />
               <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">Total Gen</p>
               <p className="text-3xl font-black text-white">4,280 <span className="text-lg text-emerald-500/50">kWh</span></p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl">
               <Factory className="text-amber-400 mb-4" size={24} />
               <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">Money Saved</p>
               <p className="text-3xl font-black text-white">₹32,450</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl">
               <Leaf className="text-blue-400 mb-4" size={24} />
               <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">CO2 Avoided</p>
               <p className="text-3xl font-black text-white">3.2 <span className="text-lg text-blue-500/50">Tons</span></p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl">
               <CheckCircle2 className="text-indigo-400 mb-4" size={24} />
               <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">System Health</p>
               <p className="text-3xl font-black text-white">100%</p>
            </div>
         </div>

          {/* Chart Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-emerald-500" size={20} />
                  Generation Trends
               </h3>
               <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Export Data</button>
            </div>
            <div className="h-80">
               <SavingsChart />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Log Entry Form */}
             <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <PlusCircle className="text-primary-400" size={18} />
                   Log Monthly Units
                </h3>
                <p className="text-slate-400 text-sm mb-6">Enter your grid reading and solar generation for this month.</p>
                <form className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Month</label>
                         <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm">
                            <option>August 2026</option>
                            <option>September 2026</option>
                         </select>
                      </div>
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Solar Units (kWh)</label>
                         <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="e.g. 450" />
                      </div>
                   </div>
                   <button className="w-full py-3 bg-primary-500 hover:bg-primary-400 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-primary-500/20">
                      Update Stats
                   </button>
                </form>
             </div>

             {/* Tips Section */}
             <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-emerald-400 mb-4">Optimization Tip</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                   Your generation reached a peak of 640 kWh last month. To maintain this efficiency, we recommend cleaning your panels this weekend.
                </p>
                <div className="p-4 bg-emerald-500/10 rounded-xl">
                   <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Impact of Cleaning</p>
                   <p className="text-xl font-bold text-white">+15-20% Efficiency</p>
                </div>
             </div>
          </div>
       </div>
    </DashboardLayout>
  )
}
