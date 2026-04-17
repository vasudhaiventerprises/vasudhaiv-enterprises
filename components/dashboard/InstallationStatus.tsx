'use client'

import { Shield, Hammer, Clock } from 'lucide-react'

interface InstallationStatusProps {
  systemSizeKw?: number
  installDate?: string
  warrantyExpiry?: string
  amcExpiry?: string
}

export default function InstallationStatus({ systemSizeKw, installDate, warrantyExpiry, amcExpiry }: InstallationStatusProps) {
  const isWarrantyActive = warrantyExpiry ? new Date(warrantyExpiry) > new Date() : false
  const isAmcActive = amcExpiry ? new Date(amcExpiry) > new Date() : false

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 overflow-hidden relative">
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="text-primary-400" size={20} />
          System & Protection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Size</p>
            <p className="text-xl font-bold text-white">{systemSizeKw ? `${systemSizeKw} kW` : 'N/A'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Installation Date</p>
            <p className="text-xl font-bold text-white">{installDate ? new Date(installDate).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Warranty Status</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isWarrantyActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <p className="text-xl font-bold text-white">{isWarrantyActive ? 'Active' : 'Expired'}</p>
            </div>
            <p className="text-[10px] text-slate-400">Expires: {warrantyExpiry ? new Date(warrantyExpiry).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">AMC Status</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAmcActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <p className="text-xl font-bold text-white">{isAmcActive ? 'Active' : 'Expired'}</p>
            </div>
            <p className="text-[10px] text-slate-400">Renewal due: {amcExpiry ? new Date(amcExpiry).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Shield size={120} />
      </div>
    </div>
  )
}
