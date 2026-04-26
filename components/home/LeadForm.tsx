"use client"
import { useState } from "react"
import { sanitizeInput, sanitizePhone } from "@/lib/utils"

export default function LeadForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0)
  const COOLDOWN_MS = 60000 // 1 minute between submissions

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Client-side rate limit
    const now = Date.now()
    if (now - lastSubmitTime < COOLDOWN_MS) {
      setError("Please wait a minute before submitting again.")
      return
    }

    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const payload = {
      full_name: sanitizeInput(formData.get("full_name") as string),
      phone: sanitizePhone(formData.get("phone") as string),
      city: sanitizeInput(formData.get("city") as string),
      roof_type: sanitizeInput(formData.get("roof_type") as string),
      bill_range: sanitizeInput(formData.get("bill_range") as string),
      referral_code_used: sanitizeInput(formData.get("referral_code") as string),
      message: sanitizeInput(formData.get("message") as string),
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Submission failed")
      }

      // Process Referral extra notification (handled in API now, but if leadId is returned we can do more)
      if (payload.referral_code_used && result.leadId) {
         try {
           await fetch('/api/referral', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ referral_code: payload.referral_code_used, lead_id: result.leadId })
           })
         } catch (refErr) {
           console.error("Referral process error:", refErr)
         }
      }

      setLastSubmitTime(now)
      setLoading(false)
      setSuccess(true)
      setError(null)
      form.reset()
    } catch (err: any) {
      setLoading(false)
      setError(err.message || "Unable to submit request. Please try again.")
    }
  }

  return (
    <section id="lead-form" className="py-32 relative bg-slate-900 text-white overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-primary-600/20 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gradient border border-white/10 text-primary-300 text-xs font-bold uppercase tracking-widest mb-6">
            Get Started
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Request a Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Rooftop Survey</span></h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Every building is unique. Provide us with a few details, and our engineering team will curate a customized solar plan with estimated ROI within 24 hours.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3 text-slate-300">
              <span className="text-primary-400">✓</span> No commitment required
            </li>
            <li className="flex gap-3 text-slate-300">
              <span className="text-primary-400">✓</span> Accurate generation estimates
            </li>
            <li className="flex gap-3 text-slate-300">
              <span className="text-primary-400">✓</span> Detailed financial modelling
            </li>
          </ul>
        </div>
        
        <div className="lg:w-1/2 w-full">
          {success ? (
            <div className="glass-gradient border border-white/10 p-10 rounded-3xl text-center shadow-2xl backdrop-blur-xl animate-fade-in-up">
              <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">Request Received!</h3>
              <p className="text-slate-300 mb-8 leading-relaxed">Thank you. Our dispatch team will call you shortly on the provided number to schedule the survey.</p>
              <button 
                onClick={() => setSuccess(false)} 
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm font-semibold text-white"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-gradient border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-accent-400"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name*</label>
                  <input required name="full_name" type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number*</label>
                  <input required name="phone" type="tel" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="+91 9876543210" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">City/Area*</label>
                <input required name="city" type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="Your City" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Roof Type</label>
                  <select name="roof_type" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none">
                    <option value="RCC Flat" className="bg-slate-800">RCC Flat</option>
                    <option value="Tin Sheet" className="bg-slate-800">Tin Sheet</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Monthly Bill</label>
                  <select name="bill_range" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none">
                    <option value="₹500–1000" className="bg-slate-800">₹500–1000</option>
                    <option value="₹1000–3000" className="bg-slate-800">₹1000–3000</option>
                    <option value="₹3000+" className="bg-slate-800">₹3000+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Source</label>
                  <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none">
                    <option value="Google" className="bg-slate-800">Google Search</option>
                    <option value="WhatsApp" className="bg-slate-800">WhatsApp</option>
                    <option value="Friend" className="bg-slate-800">Word of mouth</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Referral Code</label>
                  <input name="referral_code" type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-white/20" placeholder="Optional" />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                <textarea name="message" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-white/20 resize-none" rows={2} placeholder="Any specific requirements..."></textarea>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full relative group px-8 py-4 bg-primary-500 text-white font-bold rounded-xl overflow-hidden transition-all disabled:opacity-50"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">
                  {loading ? "Submitting Request..." : "Request Call Back"}
                </span>
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center animate-shake">
                  ⚠️ {error}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
