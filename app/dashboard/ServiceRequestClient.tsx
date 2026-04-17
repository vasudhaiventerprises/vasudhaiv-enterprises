"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus } from 'lucide-react'

export default function ServiceRequestClient({ userId, initialRequests }: { userId: string, initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [issueType, setIssueType] = useState('Routine Maintenance')
  const [description, setDescription] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Listen for realtime updates
    const channel = supabase
      .channel('public:service_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests', filter: `client_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRequests((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setRequests((prev) => prev.map((req) => (req.id === payload.new.id ? payload.new : req)))
          } else if (payload.eventType === 'DELETE') {
            setRequests((prev) => prev.filter((req) => req.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase.from('service_requests').insert({
      client_id: userId,
      issue_type: issueType,
      description,
      preferred_date: preferredDate || null,
      status: 'pending'
    })

    setIsSubmitting(false)
    if (!error) {
      setIsModalOpen(false)
      setDescription('')
      setPreferredDate('')
    } else {
      alert("Error submitting request: " + error.message)
    }
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">My Service Requests</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-slate-400">No service requests yet. Your system is running smoothly!</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white mb-1">{req.issue_type}</p>
                <p className="text-xs text-slate-400">{new Date(req.created_at).toLocaleDateString()} • Preferred: {req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : 'ASAP'}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border ${
                  req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  req.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  req.status === 'assigned' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {req.status}
                </span>
                {req.assigned_staff && <p className="text-xs text-slate-400 max-w-[100px] truncate" title="Assigned Staff ID">Assigned</p>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Raise Service Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Issue Type</label>
                <select 
                  value={issueType} 
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                >
                  <option>Routine Maintenance</option>
                  <option>Panel Cleaning</option>
                  <option>Inverter Issue</option>
                  <option>Wiring Problem</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue briefly..."
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Preferred Date</label>
                <input 
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
