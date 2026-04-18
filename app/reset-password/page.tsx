"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Logo from '@/components/shared/Logo'
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  // Ensure we have a session (the callback handles this, but safety first)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("Your reset session has expired. Please request a new link from the login page.")
      }
    }
    checkSession()
  }, [supabase.auth])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=Password updated successfully. Please sign in with your new password.')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none bg-emerald-500/10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none bg-amber-500/10" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-6" size="lg" />
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Security Update
          </h1>
          <p className="text-slate-400 text-sm">
            Set a new secure password for your Vasudhaiv account.
          </p>
        </div>

        <div className="border p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/5 border-white/10">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password Updated!</h2>
              <p className="text-slate-400 text-sm mb-6">Your security credentials have been refreshed. Redirecting you to login...</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-progress" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3.5 pr-11 text-white transition-all focus:outline-none bg-slate-900/50 border border-white/10 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    placeholder="Min 6 characters" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input 
                    required 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3.5 text-white transition-all focus:outline-none bg-slate-900/50 border border-white/10 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    placeholder="Verify new password" 
                  />
                </div>
              </div>

              <button 
                disabled={loading || !!error}
                type="submit" 
                className="w-full py-4 font-extrabold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                {loading ? <span className="animate-pulse">Updating...</span> : <><ShieldCheck size={18} /> Update Password</>}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push('/login')}
            className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-emerald-400 transition-colors flex items-center justify-center mx-auto gap-2"
          >
            Cancel and Return to login <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  )
}
