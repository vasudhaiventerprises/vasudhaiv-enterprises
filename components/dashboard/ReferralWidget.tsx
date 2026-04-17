'use client'

interface ReferralWidgetProps {
  referralCode: string
  referredCount: number
  convertedCount: number
  totalRewards: number
}

export default function ReferralWidget({ referralCode, referredCount, convertedCount, totalRewards }: ReferralWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-primary-600/20 to-accent-500/20 border border-white/10 p-10 rounded-3xl relative overflow-hidden mt-10">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Refer a Friend & Earn ₹500</h2>
          <p className="text-slate-300 md:max-w-md mb-6">Share your love for clean energy. When your friend switches to solar, you both get rewarded.</p>
          
          <div className="inline-flex items-center gap-4 bg-black/40 py-2 pl-4 pr-2 rounded-xl border border-white/10">
             <code className="text-primary-400 font-bold">{referralCode || 'REFERRAL_CODE'}</code>
             <a 
               href={`https://wa.me/?text=I've%20been%20using%20Vasudhaiv%20Enterprises%20for%20solar%20%E2%80%94%20use%20my%20code%20${referralCode}%20for%20%E2%88%B9500%20off!%20vasudhaiventerprises.in`}
               target="_blank"
               rel="noreferrer"
               className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition-colors"
             >
               Share on WhatsApp
             </a>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full md:w-auto">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Referral Stats</h3>
           <div className="space-y-3">
              <div className="flex justify-between gap-8">
                 <span className="text-slate-300">Total Referred</span>
                 <span className="font-bold text-white">{referredCount}</span>
              </div>
              <div className="flex justify-between gap-8 border-t border-white/10 pt-3">
                 <span className="text-slate-300">Converted</span>
                 <span className="font-bold text-primary-400">{convertedCount}</span>
              </div>
              <div className="flex justify-between gap-8 border-t border-white/10 pt-3">
                 <span className="text-slate-300">Rewards Earned</span>
                 <span className="font-bold text-amber-400">₹{totalRewards}</span>
              </div>
           </div>
        </div>
      </div>
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]"></div>
    </div>
  )
}
