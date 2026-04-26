"use client"
import { useState } from "react"
import { Calculator, ArrowRight, Zap, PiggyBank } from "lucide-react"

export default function RoiCalculator() {
  const [bill, setBill] = useState<number | ''>(3000)

  // Calculations based on UP tariffs and PM Surya Ghar Subsidy
  const monthlyBill = Number(bill) || 0
  
  // 1kW generates ~120 units/month, which saves approx Rs 1000 in UP
  const systemSize = Math.max(1, Math.min(10, Math.ceil(monthlyBill / 1000))) 
  
  const monthlySavings = monthlyBill
  const yearlySavings = monthlyBill * 12
  const costPerKw = 60000 // Approximate average market rate before subsidy
  const grossCost = systemSize * costPerKw
  
  // PM Surya Ghar Subsidy slabs (2024-2025)
  let subsidy = 0
  if (systemSize === 1) subsidy = 30000
  else if (systemSize === 2) subsidy = 60000
  else if (systemSize >= 3) subsidy = 78000

  const netCost = Math.max(0, grossCost - subsidy)
  const paybackMonths = monthlySavings > 0 ? Math.ceil(netCost / monthlySavings) : 0
  const twentyFiveYearSavings = yearlySavings * 25

  return (
    <div className="bg-slate-800/40 border border-emerald-500/20 rounded-[24px] p-6 md:p-10 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto w-full my-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <Calculator className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Calculate Your Solar Savings</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Section */}
        <div className="space-y-8">
          <div>
            <label className="text-slate-300 font-medium block mb-3 text-sm tracking-wide uppercase">Your Average Monthly Electricity Bill</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-semibold text-lg">₹</span>
              <input 
                type="number" 
                value={bill}
                onChange={(e) => setBill(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                placeholder="3000"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <h4 className="text-emerald-400 font-semibold mb-2">Recommended System</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{systemSize}</span>
              <span className="text-xl text-slate-400 mb-1 font-semibold">kW</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">Requires approx. {systemSize * 100} sq.ft. of shadow-free rooftop space.</p>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col justify-center space-y-6 bg-emerald-900/10 p-6 md:p-8 rounded-2xl border border-emerald-500/10">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium flex items-center gap-1.5"><Zap size={14} className="text-amber-400"/> Govt Subsidy</p>
              <p className="text-2xl md:text-3xl font-bold text-white">₹{subsidy.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium flex items-center gap-1.5"><PiggyBank size={14} className="text-emerald-400"/> Payback Time</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{paybackMonths} <span className="text-lg text-slate-400 font-medium">months</span></p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <p className="text-emerald-400 text-sm mb-1 font-medium uppercase tracking-wider">Estimated 25-Year Savings</p>
            <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              ₹{twentyFiveYearSavings.toLocaleString()}
            </p>
          </div>

          <a 
            href={`https://wa.me/918840315311?text=${encodeURIComponent(`Hi, I checked the calculator. My monthly bill is ₹${monthlyBill}. I want to know more about a ${systemSize}kW system.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-1"
          >
            Get Free Quote <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
