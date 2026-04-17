'use client'

import { useState } from 'react'
import { takeJob, completeJob } from '@/lib/actions/staff'
import { Loader2 } from 'lucide-react'

interface JobActionsProps {
  jobId: string
  staffId?: string
  type: 'take' | 'complete'
}

export default function JobActions({ jobId, staffId, type }: JobActionsProps) {
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [showNoteModal, setShowNoteModal] = useState(false)

  async function handleTake() {
    if (!staffId) return
    setLoading(true)
    const res = await takeJob(jobId, staffId)
    if (!res.success) alert(res.error)
    setLoading(false)
  }

  async function handleComplete() {
    if (!note.trim()) {
      alert('Please provide a completion note.')
      return
    }
    setLoading(true)
    const res = await completeJob(jobId, note)
    if (!res.success) alert(res.error)
    setShowNoteModal(false)
    setLoading(false)
  }

  if (type === 'take') {
    return (
      <button 
        disabled={loading}
        onClick={handleTake}
        className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" size={12} />}
        Take Job
      </button>
    )
  }

  return (
    <>
      <button 
        disabled={loading}
        onClick={() => setShowNoteModal(true)}
        className="flex-1 text-center py-3 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        Complete Job
      </button>

      {showNoteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Complete Job Details</h3>
            <p className="text-slate-400 text-sm mb-6">Describe the work done or any parts replaced during this service.</p>
            
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 mb-6 min-h-[120px]"
              placeholder="e.g. Cleaned panels and checked wiring. Everything working fine."
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-3 text-slate-400 font-bold hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleComplete}
                disabled={loading}
                className="flex-[2] py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                Confirm Completion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
