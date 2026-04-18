"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, AlertCircle, CheckCircle2, Clock, Activity, Settings, Bell, Search, Filter, UserPlus, Shield, ShieldCheck, UserCircle, ChevronDown, BarChart3, Send } from 'lucide-react'
import Link from 'next/link'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AdminClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [leads, setLeads] = useState(initialData.leads || [])
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [creatingLead, setCreatingLead] = useState(false)
  const supabase = createClient()

  // ===== OVERVIEW TAB =====
  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Leads</p>
        <p className="text-3xl font-black text-white">{initialData.counts.leads}</p>
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Active Clients</p>
        <p className="text-3xl font-black text-emerald-400">{initialData.counts.clients}</p>
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Open Requests</p>
        <p className="text-3xl font-black text-amber-500">{initialData.counts.requests}</p>
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Staff</p>
        <p className="text-3xl font-black text-blue-400">{initialData.counts.staff}</p>
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Referrals</p>
        <p className="text-3xl font-black text-primary-400">{initialData.counts.referrals}</p>
      </div>
    </div>
  )

  // ===== LEAD STATUS UPDATE =====
  const handleLeadStatusUpdate = async (leadId: string, newStatus: string) => {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId)
    if (!error) {
      setLeads((prev: any[]) => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    }
  }

  // ===== LEADS TAB =====
  const handleCreateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreatingLead(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      roof_type: formData.get('roof_type'),
      status: 'new'
    }

    const { data, error } = await supabase.from('leads').insert(payload).select().single()
    if (!error && data) {
      setLeads([data, ...leads])
      setIsLeadModalOpen(false)
    }
    setCreatingLead(false)
  }

  const LeadsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
         <h3 className="text-xl font-bold text-white">Capture Inquiries</h3>
         <button 
           onClick={() => setIsLeadModalOpen(true)}
           className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-black font-extrabold rounded-2xl shadow-lg shadow-primary-500/20 transition-all active:scale-95"
         >
            <UserPlus size={18} />
            Add Manual Lead
         </button>
      </div>

      {isLeadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-fade-in-up">
              <button onClick={() => setIsLeadModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white">✕</button>
              <h2 className="text-2xl font-black text-white mb-6">New Lead Entry</h2>
              <form onSubmit={handleCreateLead} className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Customer Name</label>
                    <input required name="full_name" type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50" placeholder="e.g. Rajesh Kumar" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Phone Number</label>
                    <input required name="phone" type="tel" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50" placeholder="+91" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">City</label>
                        <input name="city" type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50" placeholder="Prayagraj" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Roof Type</label>
                        <select name="roof_type" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50">
                           <option value="RCC">RCC Flat</option>
                           <option value="Sheet">Tin Sheet</option>
                        </select>
                    </div>
                 </div>
                 <button 
                   disabled={creatingLead}
                   className="w-full py-4 bg-primary-500 hover:bg-primary-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-primary-500/30 mt-4 disabled:opacity-50"
                 >
                    {creatingLead ? 'Saving...' : 'Create Lead Entry'}
                 </button>
              </form>
           </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Name / Phone</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">City</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Requirement</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.length > 0 ? leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-white block">{lead.full_name}</span>
                    <span className="text-xs text-slate-500 font-medium">{lead.phone}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{lead.city || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded w-fit text-slate-400 block mb-1">
                      {lead.roof_type || 'Solar Query'}
                    </span>
                    <span className="text-[10px] text-slate-500 italic">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleLeadStatusUpdate(lead.id, e.target.value)}
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black border ${
                        lead.status === 'new' ? 'text-primary-400 border-primary-500/50' : 
                        lead.status === 'converted' ? 'text-emerald-400 border-emerald-500/50' :
                        'text-slate-400 border-white/10'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500 bg-white/[0.01]">No leads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )

  // ===== CLIENTS TAB =====
  const ClientsTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.02] border-b border-white/5">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Client Name</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Phone</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">City</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {initialData.clients?.map((client: any) => (
            <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-bold text-white">{client.full_name}</td>
              <td className="px-6 py-4 text-slate-300 text-sm">{client.phone || '-'}</td>
              <td className="px-6 py-4 text-slate-300 text-sm">{client.city || '-'}</td>
              <td className="px-6 py-4">
                <Link href={`/admin/clients/${client.id}`} className="text-xs font-bold text-primary-400 hover:text-primary-300 bg-primary-500/10 px-3 py-1.5 rounded-full inline-block text-center">
                  View Dashboard
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ===== STAFF MANAGEMENT TAB =====
  const StaffTab = () => {
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [editingUser, setEditingUser] = useState<any>(null)

    const loadUsers = async () => {
      setLoadingUsers(true)
      const { data, error } = await supabase.rpc('admin_list_users')
      if (!error && data) {
        setAllUsers(data)
      } else {
        setMessage({ type: 'error', text: 'Failed to load users. Make sure the SQL functions are set up.' })
      }
      setLoadingUsers(false)
      setLoaded(true)
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
      setUpdatingId(userId)
      setMessage(null)
      const { data, error } = await supabase.rpc('admin_set_user_role', { 
        target_user_id: userId, 
        new_role: newRole 
      })
      if (!error) {
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
        setMessage({ type: 'success', text: `Role updated to "${newRole}" successfully!` })
      } else {
        setMessage({ type: 'error', text: error.message })
      }
      setUpdatingId(null)
    }

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!editingUser) return
      setUpdatingId(editingUser.id)
      const formData = new FormData(e.currentTarget)
      const name = formData.get('full_name') as string
      const phone = formData.get('phone') as string
      const city = formData.get('city') as string

      const { error } = await supabase.rpc('admin_update_profile', {
        target_user_id: editingUser.id,
        new_name: name,
        new_phone: phone,
        new_city: city
      })

      if (!error) {
        setAllUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, full_name: name, phone, city } : u))
        setMessage({ type: 'success', text: 'User profile updated!' })
        setEditingUser(null)
      } else {
        setMessage({ type: 'error', text: error.message })
      }
      setUpdatingId(null)
    }

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
      setUpdatingId(userId)
      const { error } = await supabase.rpc('admin_set_user_status', {
        target_user_id: userId,
        active_status: !currentStatus
      })

      if (!error) {
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u))
        setMessage({ type: 'success', text: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully.` })
      } else {
        setMessage({ type: 'error', text: error.message })
      }
      setUpdatingId(null)
    }

    const handleDeleteUser = async (userId: string) => {
      if (!confirm('Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) return
      setUpdatingId(userId)
      const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId })
      if (!error) {
        setAllUsers(prev => prev.filter(u => u.id !== userId))
        setMessage({ type: 'success', text: 'User account and all data deleted permanentally.' })
      } else {
        setMessage({ type: 'error', text: error.message })
      }
      setUpdatingId(null)
    }

    const filteredUsers = allUsers.filter(u => 
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery)
    )

    const roleColors: Record<string, string> = {
      admin: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      staff: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      co_admin: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      user: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    }

    const roleIcons: Record<string, any> = {
      admin: <ShieldCheck size={14} />,
      staff: <Settings size={14} />,
      co_admin: <Shield size={14} />,
      user: <UserCircle size={14} />,
    }

    if (!loaded) {
      return (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-400">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Staff & User Management</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">View all registered users and promote or demote them to different access levels.</p>
          <button 
            onClick={loadUsers}
            disabled={loadingUsers}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-400 text-black font-extrabold rounded-xl shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50"
          >
            {loadingUsers ? 'Loading...' : 'Load All Users'}
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold text-center border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 text-sm"
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3">
          {(['admin', 'co_admin', 'staff', 'user'] as const).map(r => (
            <div key={r} className={`p-3 rounded-xl border text-center ${roleColors[r]}`}>
              <p className="text-2xl font-black">{allUsers.filter(u => u.role === r).length}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold mt-1">{r.replace('_', ' ')}s</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">User Infomation</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Access Level</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Control Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className={`hover:bg-white/[0.02] transition-colors ${!user.is_active ? 'opacity-40 grayscale' : ''}`}>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${roleColors[user.role] || roleColors.user}`}>
                             {user.full_name?.substring(0, 2).toUpperCase() || '??'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{user.full_name || 'Unnamed'}</span>
                            <span className="text-xs text-slate-400 font-medium block">{user.email}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit ${roleColors[user.role] || roleColors.user}`}>
                            {roleIcons[user.role]} {user.role?.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-600 font-mono">ID: {user.id.substring(0, 8)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={updatingId === user.id || !user.is_active}
                            className="bg-black border border-white/10 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg focus:outline-none focus:border-primary-500/50 disabled:opacity-50"
                          >
                            <option value="user">USER</option>
                            <option value="staff">STAFF</option>
                            <option value="co_admin">CO-ADMIN</option>
                            <option value="admin">ADMIN</option>
                          </select>
                          
                          <button 
                            onClick={() => setEditingUser(user)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit Profile"
                          >
                             <Settings size={14} />
                          </button>

                          <button 
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className={`p-2 border rounded-lg transition-all ${user.is_active ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'}`}
                            title={user.is_active ? 'Suspend Account' : 'Activate Account'}
                          >
                             <Activity size={14} />
                          </button>

                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 bg-red-500/5 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                            title="Permanent Delete"
                          >
                             <AlertCircle size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <button 
          onClick={loadUsers}
          className="text-xs text-slate-500 hover:text-primary-400 font-bold transition-colors"
        >
          ↻ Refresh List
        </button>
      </div>
    )
  }

  // ===== REFERRALS TAB =====
  const ReferralsTab = () => {
    const [referrals, setReferrals] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const loadReferrals = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id, status, reward_amount, reward_paid, created_at,
          referrer:profiles!referrer_id ( full_name, phone ),
          lead:leads!lead_id ( full_name, phone )
        `)
        .order('created_at', { ascending: false })
      
      if (!error && data) setReferrals(data)
      setLoading(false)
      setLoaded(true)
    }

    if (!loaded) {
      return (
        <div className="text-center py-20">
           <button onClick={loadReferrals} disabled={loading} className="px-8 py-3 bg-primary-500 text-black font-bold rounded-xl shadow-lg shadow-primary-500/20">
              {loading ? 'Loading...' : 'View Referral Log'}
           </button>
        </div>
      )
    }

    return (
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Referrer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Referred Lead</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Reward</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {referrals.map((ref: any) => (
              <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-white block">{ref.referrer?.full_name}</span>
                  <span className="text-xs text-slate-500">{ref.referrer?.phone}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-200 block">{ref.lead?.full_name}</span>
                  <span className="text-xs text-slate-500">{ref.lead?.phone}</span>
                </td>
                <td className="px-6 py-4">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                     ref.status === 'rewarded' ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' :
                     ref.status === 'converted' ? 'text-primary-400 border-primary-500/50 bg-primary-500/10' :
                     'text-slate-400 border-white/10'
                   }`}>
                     {ref.status}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <span className="text-sm font-bold text-white">₹{ref.reward_amount}</span>
                   <span className={`ml-2 text-[10px] font-bold ${ref.reward_paid ? 'text-emerald-400' : 'text-amber-500'}`}>
                     {ref.reward_paid ? 'Paid' : 'Pending'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ===== ANALYTICS TAB =====
  const AnalyticsTab = () => {
     const conversionData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
           {
              label: 'Leads',
              data: [12, 19, 15, 25, 32, 28],
              backgroundColor: 'rgba(51, 65, 85, 0.5)',
              borderRadius: 8,
           },
           {
              label: 'Conversions',
              data: [3, 5, 4, 8, 11, 9],
              backgroundColor: '#10b981',
              borderRadius: 8,
           }
        ]
     }

     return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                 <BarChart3 className="text-primary-400" size={18} />
                 Lead Conversion Funnel
              </h4>
              <div className="h-64">
                 <Bar 
                    data={conversionData} 
                    options={{ 
                       responsive: true, 
                       maintainAspectRatio: false,
                       plugins: { legend: { display: false } },
                       scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }
                    }} 
                 />
              </div>
           </div>
           
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                 <Activity size={32} />
              </div>
              <h4 className="text-3xl font-black text-white">32.4%</h4>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Avg. Conversion Rate</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-black/20 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Top Source</p>
                    <p className="text-white font-bold">Referral</p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Growth</p>
                    <p className="text-emerald-400 font-bold">+12.5%</p>
                 </div>
              </div>
           </div>
        </div>
     )
  }

  // ===== NOTIFICATIONS TAB =====
  const NotificationsTab = () => {
     const [title, setTitle] = useState('')
     const [body, setBody] = useState('')
     const [sending, setSending] = useState(false)

     const handleSendPush = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        try {
           const response = await fetch('/api/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                 title, 
                 body, 
                 targetUserId: 'global', // Logic to handle broad casts
                 type: 'system'
              })
           })
           if (response.ok) {
              alert('Notification dispatched successfully!')
              setTitle('')
              setBody('')
           }
        } catch (err) {
           console.error(err)
        }
        setSending(false)
     }

     return (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
           <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-500">
              <Bell size={24} />
           </div>
           <h3 className="text-2xl font-black text-white mb-2">Global Alert Dispatch</h3>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">Broadcast a push notification to all clients who have enabled alerts in their browser.</p>
           
           <form onSubmit={handleSendPush} className="space-y-4">
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Alert Title</label>
                 <input 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50" placeholder="e.g. Subsidy Update Available" />
              </div>
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Message Body</label>
                 <textarea 
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50 resize-none" rows={4} placeholder="Type your message here..."></textarea>
              </div>
              <button 
                 disabled={sending}
                 className="w-full py-4 bg-primary-500 hover:bg-primary-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2"
              >
                 {sending ? 'Dispatching...' : <><Send size={18} /> Dispatch Global Notification</>}
              </button>
           </form>
        </div>
     )
  }

  // ===== SERVICE REQUESTS TAB =====
  const ServiceTab = () => {
     const [requests, setRequests] = useState<any[]>([])
     const [loading, setLoading] = useState(false)
     const [loaded, setLoaded] = useState(false)
     const [updatingId, setUpdatingId] = useState<string | null>(null)

     const loadRequests = async () => {
        setLoading(true)
        const { data, error } = await supabase
           .from('service_requests')
           .select('*, client:profiles!client_id(full_name, phone)')
           .order('created_at', { ascending: false })
        
        if (!error && data) setRequests(data)
        setLoading(false)
        setLoaded(true)
     }

     const updateRequestStatus = async (id: string, status: string) => {
        setUpdatingId(id)
        const { error } = await supabase.from('service_requests').update({ status }).eq('id', id)
        if (!error) {
           setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
        }
        setUpdatingId(id === updatingId ? null : updatingId)
     }

     if (!loaded) {
        return (
           <div className="text-center py-20">
              <button onClick={loadRequests} disabled={loading} className="px-10 py-4 bg-emerald-500 text-black font-black rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                 {loading ? 'Consulting Records...' : 'Inspect Fleet Service Requests'}
              </button>
           </div>
        )
     }

     return (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Client / Contact</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Service Type</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Issue / Desc</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Status Control</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {requests.map((req: any) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-all group">
                       <td className="px-6 py-4">
                          <span className="font-black text-white block mb-0.5">{req.client?.full_name || 'Unknown'}</span>
                          <span className="text-xs text-slate-500 font-bold">{req.client?.phone || '-'}</span>
                       </td>
                       <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-300 tracking-widest">
                             {req.request_type || 'General'}
                          </span>
                       </td>
                       <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{req.description || 'No description provided.'}</p>
                          <span className="text-[10px] text-slate-600 mt-2 block font-medium uppercase tracking-tighter">Registered: {new Date(req.created_at).toLocaleString()}</span>
                       </td>
                       <td className="px-6 py-4">
                          <select 
                            value={req.status}
                            onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl bg-black border transition-all ${
                               req.status === 'pending' ? 'text-amber-400 border-amber-500/50' : 
                               req.status === 'completed' ? 'text-emerald-400 border-emerald-500/50' :
                               req.status === 'canceled' ? 'text-red-400 border-red-500/50' :
                               'text-blue-400 border-blue-500/50'
                            }`}
                          >
                             <option value="pending">⏳ Pending Review</option>
                             <option value="approved">✅ Approved</option>
                             <option value="in_progress">⚡ In Progress</option>
                             <option value="completed">🏆 Completed</option>
                             <option value="canceled">🚫 Canceled</option>
                          </select>
                       </td>
                    </tr>
                 ))}
                 {requests.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-500 bg-white/[0.01] italic">No active field requests found.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
     )
  }

  // ===== TAB RENDERER =====
  const renderTab = () => {
    switch(activeTab) {
      case 'Overview': return <OverviewTab />
      case 'Leads': return <LeadsTab />
      case 'Clients': return <ClientsTab />
      case 'Service Requests': return <ServiceTab />
      case 'Staff': return <StaffTab />
      case 'Referrals': return <ReferralsTab />
      case 'Analytics': return <AnalyticsTab />
      case 'Notifications': return <NotificationsTab />
      default: return <div className="text-slate-500 text-center py-20 bg-white/5 border border-white/10 rounded-2xl italic">Module "{activeTab}" is coming in the next build!</div>
    }
  }

  const tabs = ['Overview', 'Leads', 'Clients', 'Service Requests', 'Staff', 'Referrals', 'Analytics', 'Notifications']

  return (
    <div className="space-y-8 pb-20">
      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-2">
        {tabs.map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === t 
              ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' 
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div>
        {renderTab()}
      </div>
    </div>
  )
}
