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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 bg-[#0a0f1c] text-slate-50 font-sans">
      {/* Interactive Solar Background */}
      <SolarBackground />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: High-Impact Copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-[20px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold tracking-[0.1em] uppercase mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Government Certified Net Metering • Subsidies Available
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-semibold mb-8 leading-[1.1] text-white tracking-tight">
              Solar Panel Installation <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-400">in Uttar Pradesh</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl text-slate-300 mb-10 font-normal leading-relaxed max-w-xl">
              Rooftop Solar Solutions for Homes & Businesses in Uttar Pradesh. Generate your own electricity and save big on bills. <br/>
              <a href="tel:+918840315311" className="text-emerald-400 font-semibold font-mono mt-3 inline-block bg-emerald-900/30 px-3 py-1 rounded-md border border-emerald-500/20 hover:bg-emerald-800/40 hover:-translate-y-0.5 transition-all cursor-pointer">Call: +91 8840315311</a>
            </h2>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-5 rounded-[12px] bg-slate-900/40 backdrop-blur-xl border border-white/10 max-w-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#0a0f1c] bg-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-lg">R</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0a0f1c] bg-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-sm shadow-lg">S</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0a0f1c] bg-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm shadow-lg">P</div>
              </div>
              <div>
                <div className="flex gap-1 text-amber-400 mb-1 text-xs">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-[13px] text-slate-300 font-medium">Trusted by <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded text-sm">5000+</strong> local families</p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="w-full max-w-md mx-auto xl:ml-auto animate-float relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-[16px] blur-3xl -z-10"></div>
            
            <div className="bg-[#0a0f1c]/70 backdrop-blur-2xl border-l-[4px] border-l-emerald-500 border border-white/10 hover:border-l-amber-400 hover:shadow-[0_0_40px_rgba(52,211,153,0.2)] transition-all duration-500 p-8 rounded-[16px] shadow-2xl relative overflow-hidden">
              {/* Subtle top glare */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
              
              <h3 className="text-2xl font-semibold text-white mb-2">Get Your Free Solar Plan</h3>
              <p className="text-emerald-400/80 text-sm mb-8 font-mono text-[13px] tracking-wide">Our engineers will call you within 2 hours</p>
              
              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 text-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)]">✓</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Request Successful!</h4>
                  <p className="text-slate-400 text-[13px]">We've received your details.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2 block">Full Name</label>
                    <input required name="name" type="text" placeholder="Rahul Kumar" className="w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[10px] px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-[14px] shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2 block">Mobile Number</label>
                    <input required name="phone" type="tel" placeholder="+91 8840315311" className="w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[10px] px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-[14px] shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-2 block">City / Area</label>
                    <input required name="city" type="text" placeholder="Your City" className="w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[10px] px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-[14px] shadow-inner" />
                  </div>
                  
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="mt-3 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-[10px] py-4 transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                  >
                    {loading ? (
                      <>
                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                         Processing
                      </>
                    ) : "Get My Free Quote"}
                  </button>

                  {error && (
                    <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-[8px] text-red-400 text-xs font-semibold text-center animate-shake">
                      ⚠️ {error}
                    </div>
                  )}

                  <p className="text-center text-[10px] tracking-[0.15em] text-slate-500 mt-2 font-medium flex items-center justify-center gap-1.5 uppercase">
                    <span className="text-emerald-500">🔒</span> Secure Information
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
