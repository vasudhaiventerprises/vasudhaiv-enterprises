"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const trimmedEmail = email.trim()

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (signInError) {
      setError(signInError.message.includes('Invalid login') 
        ? 'Access Denied: Invalid credentials.' 
        : signInError.message)
      setLoading(false)
      return
    }

    // Role Enforcement
    let role = 'user'
    try {
      const roleRes = await fetch('/api/check-role')
      if (roleRes.ok) {
        const roleData = await roleRes.json()
        role = roleData.role || 'user'
      }
    } catch {
      if (signInData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .maybeSingle()
        role = profile?.role || 'user'
      }
    }

    if (role !== 'admin' && role !== 'staff' && role !== 'co_admin') {
      await supabase.auth.signOut()
      setError("SECURITY INCIDENT: Unauthorized access attempt logged. You do not have staff clearance.")
      setLoading(false)
      return
    }

    router.refresh()
    if (role === 'admin') router.push('/admin')
    else if (role === 'staff') router.push('/staff')
    else if (role === 'co_admin') router.push('/co-admin')
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-[#020617] selection:bg-primary-500/30">
      
      {/* Intense Security Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fbbf240a_1px,transparent_1px),linear-gradient(to_bottom,#fbbf240a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-primary-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[420px] w-full relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-400 font-bold text-xs uppercase tracking-widest mb-10 transition-colors">
           <ArrowLeft size={14} /> Back to Public Portal
        </Link>

        {/* Auth Module */}
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
           
           {/* Cybernetic Accent Line */}
           <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

           <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                 <Shield className="text-primary-400" size={32} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight text-center">Secure Subsystem</h1>
              <p className="text-primary-500/80 text-[10px] font-black tracking-[0.2em] uppercase mt-2">Authorized Staff Only</p>
           </div>

           {error && (
             <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-mono font-bold leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
               &gt; ERR: {error}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Clearance ID (Email)
                </label>
                <div className="relative">
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-sm placeholder-slate-700 focus:outline-none focus:border-primary-500/50 transition-all shadow-inner"
                    placeholder="agent@vasudhaiv.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Encryption Key
                  </label>
                </div>
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-lg tracking-[0.2em] placeholder-slate-700 focus:outline-none focus:border-primary-500/50 transition-all shadow-inner"
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary-400 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full py-4 mt-2 bg-primary-500 hover:bg-primary-400 text-[#020617] font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                   <span className="flex items-center gap-2 animate-pulse">
                      <Lock size={14} className="animate-spin" /> Verifying Clearance...
                   </span>
                ) : (
                   <><Lock size={14} /> Establish Connection</>
                )}
              </button>
           </form>

        </div>
        
        <div className="text-center mt-8">
           <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">
              Vasudhaiv Operations Network v2.4
           </p>
        </div>
      </div>
    </div>
  )
}
