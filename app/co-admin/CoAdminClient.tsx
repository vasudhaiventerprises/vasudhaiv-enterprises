'use client'
import { useState } from 'react'
import { Users, FileText, Wrench, Search, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function CoAdminClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState('Leads')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = ['Leads', 'Clients', 'Service Requests']

  const renderContent = () => {
    switch(activeTab) {
      case 'Leads':
        return (
          <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Lead Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">City</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {initialData.leads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                         <td className="px-6 py-4">
                            <p className="font-bold text-white">{lead.full_name}</p>
                            <p className="text-xs text-slate-500">{lead.phone}</p>
                         </td>
                         <td className="px-6 py-4 text-sm text-slate-300">{lead.city}</td>
                         <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">{lead.status}</span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )
      case 'Clients':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {initialData.clients.map((client: any) => (
                <Link key={client.id} href={`/admin/clients/${client.id}`} className="block p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-primary-500/30 transition-all">
                   <p className="font-bold text-white mb-1">{client.full_name}</p>
                   <p className="text-xs text-slate-500 mb-4">{client.phone}</p>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <MapPin size={12} /> {client.city || 'Allahabad'}
                   </div>
                </Link>
             ))}
          </div>
        )
      case 'Service Requests':
        return (
          <div className="space-y-4">
             {initialData.requests.map((req: any) => (
                <div key={req.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center">
                   <div>
                      <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-1">{req.issue_type}</p>
                      <p className="font-bold text-white mb-1">{req.client?.full_name}</p>
                      <p className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</p>
                   </div>
                   <span className="text-xs font-bold px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-slate-400">
                      {req.status}
                   </span>
                </div>
             ))}
          </div>
        )
      default: return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === t ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative">
         <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
         <input
            type="text"
            placeholder="Search records..."
            className="w-full bg-slate-900 border border-white/10 rounded-3xl pl-14 pr-8 py-5 text-white focus:outline-none focus:border-primary-500/50"
         />
      </div>

      {renderContent()}
    </div>
  )
}
