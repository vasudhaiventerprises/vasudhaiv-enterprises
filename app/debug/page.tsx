"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>(['[System] Diagnostic Tool Ready'])
  const [authData, setAuthData] = useState<any>(null)
  
  // Safe client getter
  const supabase = createClient()

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev])
  }

  const runTest = async () => {
    addLog('Starting Connection Test...')
    try {
      // Test Supabase connection
      const { data, error } = await supabase.from('profiles').select('*').limit(1)
      if (error) {
        addLog(`❌ CONNECTION ERROR: ${error.message}`)
      } else {
        addLog('✅ CONNECTION OK: Database reachable.')
      }

      // Test Auth
      const { data: { user }, error: authErr } = await supabase.auth.getUser()
      if (authErr) {
        addLog(`❌ AUTH ERROR: ${authErr.message}`)
      } else if (user) {
        addLog(`✅ LOGGED IN AS: ${user.email}`)
        setAuthData(user)
      } else {
        addLog('ℹ️ STATUS: No active session (Guest)')
      }
    } catch (e: any) {
      addLog(`💥 FATAL CRASH: ${e.message}`)
    }
  }

  const nuke = async () => {
    addLog('SIGNING OUT & CLEARING ALL COOKIES...')
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    addLog('CLEANUP COMPLETE. RELOADING IN 2 SECONDS...')
    setTimeout(() => window.location.reload(), 2000)
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="min-h-screen bg-black text-emerald-500 p-10 font-mono">
      <h1 className="text-2xl font-bold mb-8 border-b border-emerald-900 pb-4">
        FORCE DIAGNOSTICS v3.0
      </h1>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={runTest}
          className="bg-emerald-950 border border-emerald-500 px-6 py-3 rounded hover:bg-emerald-900 text-white font-bold"
        >
          RUN CONNECTION TEST
        </button>
        <button 
          onClick={nuke}
          className="bg-red-950 border border-red-500 px-6 py-3 rounded hover:bg-red-900 text-white font-bold"
        >
          NUKE SESSION & RESET
        </button>
      </div>

      <div className="bg-[#050505] border border-emerald-900 rounded p-6 shadow-2xl">
         <h2 className="text-xs uppercase tracking-widest text-emerald-800 mb-4 font-bold">Live Execution Log:</h2>
         <div className="space-y-2 h-[400px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className={`p-2 border-l-2 ${log.includes('❌') || log.includes('💥') ? 'border-red-500 bg-red-950/20 text-red-500' : 'border-emerald-500 bg-emerald-950/20'}`}>
                {log}
              </div>
            ))}
         </div>
      </div>

      {authData && (
        <div className="mt-8 p-6 bg-blue-950/20 border border-blue-900 rounded">
           <p className="text-blue-400 font-bold mb-2 uppercase text-xs">Auth Metadata:</p>
           <pre className="text-[10px] text-blue-300">
             {JSON.stringify(authData.app_metadata, null, 2)}
           </pre>
        </div>
      )}
    </div>
  )
}
