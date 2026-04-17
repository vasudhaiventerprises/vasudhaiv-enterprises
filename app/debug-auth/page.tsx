"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function DebugAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileError, setProfileError] = useState<any>(null)
  const [fixing, setFixing] = useState(false)
  const [fixResult, setFixResult] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      setProfile(data)
      setProfileError(error)
    }
  }

  async function handleDeleteAndRecreate() {
    if (!user) return
    setFixing(true)
    setFixResult(null)

    // Step 1: Delete any existing row (ignore errors if it doesn't exist)
    await supabase.from('profiles').delete().eq('id', user.id)

    // Step 2: Insert fresh row
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Admin',
        role: 'admin',
      })

    if (error) {
      setFixResult(`❌ Insert failed: ${error.message} (${error.code})\n\nYou need to run this SQL in your Supabase SQL Editor:\n\nCREATE POLICY "user_insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);`)
    } else {
      setFixResult('✅ Profile created! Refreshing...')
      await loadData()
    }
    setFixing(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="p-6 md:p-10 bg-[#070b14] text-white min-h-screen font-mono text-sm">
      <h1 className="text-2xl font-bold mb-2 text-emerald-400">🔧 Auth Diagnostic & Repair</h1>
      <p className="text-slate-500 mb-8">This page helps you fix login/role issues.</p>
      
      <div className="space-y-8 max-w-3xl">

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border ${user ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Auth Status</p>
            <p className="text-lg font-bold">{user ? '✅ Logged In' : '❌ Not Logged In'}</p>
          </div>
          <div className={`p-5 rounded-2xl border ${profile ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Profile Row</p>
            <p className="text-lg font-bold">{profile ? '✅ Found' : '❌ Missing'}</p>
          </div>
          <div className={`p-5 rounded-2xl border ${profile?.role === 'admin' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Detected Role</p>
            <p className="text-lg font-bold">{profile?.role || '(none)'}</p>
          </div>
        </div>

        {/* Fix Actions */}
        <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleDeleteAndRecreate}
              disabled={fixing || !user}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all disabled:opacity-40"
            >
              {fixing ? "Working..." : "🔧 Fix: Create Admin Profile"}
            </button>
            <button onClick={loadData} className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl">
              🔄 Refresh Data
            </button>
            <button onClick={handleSignOut} className="px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded-xl">
              🚪 Sign Out
            </button>
          </div>

          {fixResult && (
            <pre className="mt-4 p-4 bg-black/50 border border-white/10 rounded-xl whitespace-pre-wrap text-xs">
              {fixResult}
            </pre>
          )}
        </section>

        {/* Raw Data */}
        <section>
          <h2 className="text-emerald-500 mb-2">Auth User Details</h2>
          <pre className="bg-black/50 p-4 rounded-xl border border-white/10 overflow-auto max-h-40 text-[10px]">
            {user ? `ID: ${user.id}\nEmail: ${user.email}` : 'Not logged in — go to /login first'}
          </pre>
        </section>

        <section>
          <h2 className="text-emerald-500 mb-2">Profile Table Query Result</h2>
          {profileError ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              ❌ Error: {profileError.message} ({profileError.code})
            </div>
          ) : profile ? (
            <pre className="bg-black/50 p-4 rounded-xl border border-emerald-500/20 text-emerald-400 overflow-auto text-[10px]">
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              ⚠️ No profile row found for your user ID. Click "Fix: Create Admin Profile" above.
              <p className="mt-2 text-xs text-slate-500">If the fix button fails, you need to add this RLS policy in your Supabase SQL Editor:</p>
              <code className="block mt-2 p-2 bg-black/40 rounded text-emerald-400 text-[10px]">
                CREATE POLICY "user_insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
              </code>
            </div>
          )}
        </section>

        {/* Manual SQL Instructions */}
        <section className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
          <h2 className="text-indigo-400 font-bold mb-4">📋 Manual Fix (if button doesn't work)</h2>
          <p className="text-slate-300 text-xs mb-4">Go to Supabase Dashboard → SQL Editor → paste and run:</p>
          <pre className="bg-black/50 p-4 rounded-xl text-[11px] text-emerald-400 overflow-auto select-all">
{`-- Step 1: Add missing INSERT policy
CREATE POLICY "user_insert_own_profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 2: Ensure your profile exists with admin role
INSERT INTO public.profiles (id, full_name, role)
VALUES ('${user?.id || 'YOUR_USER_ID_HERE'}', '${user?.email?.split('@')[0] || 'Admin'}', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';`}
          </pre>
          <p className="text-slate-500 text-xs mt-3">After running this SQL, go to <a href="/login" className="text-indigo-400 underline">/login</a>, sign out and sign back in.</p>
        </section>
      </div>
    </div>
  )
}
