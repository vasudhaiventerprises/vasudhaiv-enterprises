"use client"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import SolarBackground from "./SolarBackground"

export default function HeroSection() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = {
      full_name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      status: "new",
      message: "Quick capture from Hero Section"
    }

    const supabase = createClient()
    const { error } = await supabase.from("leads").insert([payload])
    
    setLoading(false)
    if (!error) {
      setSuccess(true)
      setError(null)
      form.reset()
    } else {
      console.error("Supabase Error:", error)
      setError(error.message || "Failed to submit. Please check your connection.")
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      {/* Interactive Solar Background */}
      <SolarBackground />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: High-Impact Copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-bold tracking-wide uppercase mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Government Certified Net Metering • Subsidies Available
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-[1.1] text-white">
              Zero Electricity Bills <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">सोलर लगाओ पैसे बचाओ..</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 font-light leading-relaxed max-w-xl">
              Govt-certified grid-connected solar power plants. Generate your own electricity for your home, college, or institute and save big on bills. <br/>
              <span className="text-emerald-400 font-bold">Call: +91 9123456789</span>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-xl">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#0a0f1c] bg-slate-200 flex items-center justify-center font-bold text-slate-700">R</div>
                <div className="w-12 h-12 rounded-full border-2 border-[#0a0f1c] bg-emerald-200 flex items-center justify-center font-bold text-emerald-700">S</div>
                <div className="w-12 h-12 rounded-full border-2 border-[#0a0f1c] bg-amber-200 flex items-center justify-center font-bold text-amber-700">P</div>
                <div className="w-12 h-12 rounded-full border-2 border-[#0a0f1c] bg-white text-slate-800 text-xs font-bold flex items-center justify-center">+5000</div>
              </div>
              <div>
                <div className="flex gap-1 text-amber-400 mb-1">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-sm text-slate-300 font-medium">Trusted by <strong className="text-white">5000+</strong> local families</p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="w-full max-w-md mx-auto xl:ml-auto animate-float relative">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-amber-500/20 rounded-[2rem] blur-2xl -z-10"></div>
            
            <div className="glass-card bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Get Your Free Solar Plan</h3>
              <p className="text-slate-400 text-sm text-center mb-8">Our engineers will call you within 2 hours</p>
              
              {success ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 text-3xl">✓</div>
                  <h4 className="text-xl font-bold text-white mb-2">Request Successful!</h4>
                  <p className="text-slate-400">We've received your details.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1.5 block">Full Name</label>
                    <input required name="name" type="text" placeholder="Rahul Kumar" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1.5 block">Mobile Number</label>
                    <input required name="phone" type="tel" placeholder="+91 90000 00000" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1.5 block">City / Area</label>
                    <input required name="city" type="text" placeholder="Allahabad" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" />
                  </div>
                  
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold uppercase tracking-wide py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? "Processing..." : "Get My Free Quote"}
                  </button>

                  {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center animate-shake">
                      ⚠️ {error}
                    </div>
                  )}

                  <p className="text-center text-xs text-slate-500 mt-2 font-medium flex items-center justify-center gap-1.5">
                    <span className="text-emerald-500">🔒</span> Your information is 100% secure.
                  </p>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
