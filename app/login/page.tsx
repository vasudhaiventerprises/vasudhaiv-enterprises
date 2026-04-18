"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import { Shield, User, Eye, EyeOff, Phone, Mail, ArrowRight, Sparkles, UserPlus } from 'lucide-react'

export default function UnifiedLoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  // Detect if input is a phone number
  const isPhone = (val: string) => /^[+]?\d{10,15}$/.test(val.replace(/\s/g, ''))

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    let loginEmail = identifier.trim()

    // If identifier looks like a phone number, resolve to email
    if (isPhone(loginEmail)) {
      try {
        const { data, error: rpcError } = await supabase.rpc('get_email_by_phone', { phone_input: loginEmail.replace(/\s/g, '') })
        if (rpcError || !data) {
          setError('No account found with this phone number. Please use your email instead.')
          setLoading(false)
          return
        }
        loginEmail = data
      } catch {
        setError('Phone login is not available. Please use your email address.')
        setLoading(false)
        return
      }
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })

    if (signInError) {
      if (signInError.message.toLowerCase().includes('email not confirmed')) {
        setError('Please check your email inbox and click the verification link before signing in.')
      } else if (signInError.message.includes('Invalid login')) {
        setError('Invalid email/phone or password. Please try again.')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    // Fetch role — try RPC first, then direct query
    let role = 'user'
    try {
      const roleRes = await fetch('/api/check-role')
      if (roleRes.ok) {
        const roleData = await roleRes.json()
        role = roleData.role || 'user'
      }
    } catch {
      // Fallback: query profiles directly
      if (signInData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .maybeSingle()
        role = profile?.role || 'user'
      }
    }

    router.refresh()
    
    // Check for redirect parameter
    const searchParams = typeof window !== 'undefined' ? new URL(window.location.href).searchParams : null
    const nextPath = searchParams?.get('next')

    if (nextPath) {
      router.push(nextPath)
    } else if (role === 'admin') {
      router.push('/admin')
    } else if (role === 'staff') {
      router.push('/staff')
    } else if (role === 'co_admin') {
      router.push('/co-admin')
    } else {
      router.push('/dashboard')
    }
  }

  async function handleSendOTP() {
    if (!identifier.trim()) {
      setError('Please enter your email or phone first.')
      return
    }

    setSendingOtp(true)
    setError(null)
    setSuccess(null)

    let otpEmail = identifier.trim()

    // Resolve phone to email if needed
    if (isPhone(otpEmail)) {
      const { data, error: rpcError } = await supabase.rpc('get_email_by_phone', { phone_input: otpEmail.replace(/\s/g, '') })
      if (rpcError || !data) {
        setError('No account found for this phone. Please use email.')
        setSendingOtp(false)
        return
      }
      otpEmail = data
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: otpEmail,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
      }
    })

    if (otpError) {
      setError(otpError.message)
      setSendingOtp(false)
    } else {
      setSuccess('Magic Link sent! Please check your email inbox to log in instantly.')
      setSendingOtp(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier.trim()) {
      setError('Please enter your email to reset your password.')
      return
    }

    setResetLoading(true)
    setError(null)
    setSuccess(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(identifier.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess('Password reset link sent! Please check your email inbox.')
    }
    setResetLoading(false)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const trimmedEmail = email.trim()
    const trimmedName = fullName.trim()
    const trimmedPhone = phone.trim()

    // Client-side validations
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError("Please enter a valid email address (e.g., name@gmail.com)")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    if (!trimmedName) {
      setError("Please enter your full name.")
      setLoading(false)
      return
    }

    // Sign up with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          phone: trimmedPhone,
        }
      }
    })

    if (signUpError) {
      // Friendly error messages
      if (signUpError.message.includes('already registered')) {
        setError("This email is already registered. Try signing in instead.")
      } else if (signUpError.message.includes('rate limit')) {
        setError("Too many attempts. Please wait a few minutes and try again.")
      } else if (signUpError.message.includes('invalid')) {
        setError("Please use a valid email address (e.g., yourname@gmail.com)")
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    // Create profile row immediately (so role is set)
    if (signUpData.user) {
      await supabase.from('profiles').upsert({
        id: signUpData.user.id,
        full_name: trimmedName,
        phone: trimmedPhone,
        role: 'user',
      }, { onConflict: 'id' })
    }

    // Success state - since confirmation is required, we don't auto-login
    setSuccess("Account created! 📧 Please check your email inbox and click the verification link to activate your account.")
    setMode('login')
    setIdentifier(trimmedEmail)
    setPassword('')
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      
      {/* Dynamic Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none bg-emerald-500/10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] rounded-full pointer-events-none bg-amber-500/10" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-6" size="lg" />
          
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === 'login' ? 'Sign in with your email or phone number.' : 'Join the solar revolution. Create your account.'}
          </p>
        </div>

        {/* Login/Signup Tab Toggle (Client Mode Only) */}
        <div className="flex mb-6 bg-white/[0.03] rounded-2xl border border-white/5 p-1">
            <button 
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'login' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ArrowRight size={14} /> Sign In
            </button>
            <button 
              onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'signup' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserPlus size={14} /> Create Account
            </button>
          </div>

        <div className="border p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/5 border-white/10">
          
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center animate-shake">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold text-center">
              ✅ {success}
            </div>
          )}

          {/* ====== FORGOT PASSWORD FORM ====== */}
          {mode === 'login' && isForgotPassword && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="text-center mb-6">
                <Shield size={32} className="mx-auto text-emerald-500 mb-3 opacity-50" />
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-slate-400 text-xs">Enter your email and we'll send a recovery link.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  placeholder="name@email.com"
                />
              </div>

              <button 
                disabled={resetLoading}
                type="submit" 
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {resetLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>

              <button 
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccess(null); }}
                className="w-full text-slate-500 hover:text-white text-xs font-bold transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* ====== LOGIN FORM ====== */}
          {mode === 'login' && !isForgotPassword && (
            <div className="space-y-5">
              <div className="flex justify-center mb-4">
                <div className="bg-white/5 p-1 rounded-xl border border-white/5 w-full flex">
                  <button 
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${loginMethod === 'password' ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}
                  >
                    Password
                  </button>
                  <button 
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${loginMethod === 'otp' ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}
                  >
                    Free OTP (Magic Link)
                  </button>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <input 
                      required 
                      type="text" 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 pl-11 text-white transition-all font-medium focus:outline-none bg-slate-900/50 border border-white/10 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="email@gmail.com or 9876543210"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      {isPhone(identifier) ? <Phone size={16} /> : <Mail size={16} />}
                    </div>
                  </div>
                </div>

                {loginMethod === 'password' ? (
                  <>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Password
                        </label>
                        <button 
                          type="button"
                          onClick={() => { setIsForgotPassword(true); setError(null); setSuccess(null); }}
                          className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          required 
                          type={showPassword ? 'text' : 'password'} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl px-4 py-3.5 pr-11 text-white transition-all focus:outline-none bg-slate-900/50 border border-white/10 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                          placeholder="••••••••" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      disabled={loading}
                      type="submit" 
                      className="w-full py-4 font-extrabold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                    >
                      {loading ? <span className="animate-pulse">Authenticating...</span> : 'Sign In'}
                    </button>
                  </>
                ) : (
                  <button 
                    type="button"
                    disabled={sendingOtp}
                    onClick={handleSendOTP}
                    className="w-full py-4 font-extrabold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    {sendingOtp ? <span className="animate-pulse">Sending Link...</span> : 'Send Magic Link Email'}
                  </button>
                )}
              </form>
            </div>
          )}

          {/* ====== SIGNUP FORM ====== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  placeholder="Krishna Kushwaha"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium text-sm"
                    placeholder="you@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Phone</label>
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium text-sm"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                    placeholder="Min 6 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Confirm Password</label>
                <input 
                  required 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  placeholder="Re-enter password"
                />
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <span className="animate-pulse">Creating Account...</span> : <><Sparkles size={16} /> Create My Account</>}
              </button>
            </form>
          )}
        </div>

        {mode === 'login' && (
          <p className="mt-6 text-center text-slate-500 text-sm">
            New to solar?{' '}
            <button onClick={() => { setMode('signup'); setError(null); }} className="text-white font-bold hover:text-emerald-400 transition-colors">
              Create an account
            </button>
          </p>
        )}
        {mode === 'signup' && (
          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <button onClick={() => { setMode('login'); setError(null); }} className="text-white font-bold hover:text-emerald-400 transition-colors">
              Sign in
            </button>
          </p>
        )}

        <div className="mt-12 text-center">
           <Link href="/admin/login" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-primary-400 transition-colors">
              Go to Subsystem (Staff Auth)
           </Link>
        </div>
      </div>
    </div>
  )
}
