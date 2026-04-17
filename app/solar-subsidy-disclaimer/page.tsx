import { AlertTriangle, Clock, FileText, CheckCircle2 } from 'lucide-react'

export default function SubsidyDisclaimerPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/20 p-10 md:p-16 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <AlertTriangle size={120} className="text-amber-500" />
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4 relative z-10">Solar Subsidy Disclaimer</h1>
          <p className="text-amber-400 font-bold mb-10 tracking-widest uppercase text-xs relative z-10">Important Notice for Rooftop Solar Clients</p>
          
          <div className="prose prose-invert max-w-none space-y-8 relative z-10">
            <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Clock className="text-amber-500" size={24} />
                Timeline Disclaimer
              </h2>
              <p>Government subsidies for solar projects (PM Surya Ghar / MNRE) are processed by DISCOMs and national portals. The typical timeline for subsidy disbursement is 30–90 days AFTER net-metering installation. Vasudhaiv Enterprises has no control over these timelines.</p>
            </section>

            <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <FileText className="text-amber-500" size={24} />
                Approval Disclaimer
              </h2>
              <p>Eligibility for subsidy is determined solely by the Government of India and the respective State Nodal Agency. Rejection due to technical non-compliance of the site, document mismatch, or policy changes is the responsibility of the client. Vasudhaiv Enterprises acts as a facilitator for documentation only.</p>
            </section>

            <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-amber-500" size={24} />
                Component Requirements
              </h2>
              <p>Subsidies are only available for Residential grid-connected systems using DCR (Domestic Content Requirement) solar modules from the ALMM list. Industrial and Commercial installations generally do not qualify for central subsidies unless specified by special state policies.</p>
            </section>

            <div className="mt-12 p-6 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl">
               <p className="text-sm italic text-amber-200">
                 "By proceeding with the installation, the client acknowledges they have read and understood that the subsidy is a subject of government approval and Vasudhaiv Enterprises is not liable for any financial loss due to subsidy rejection."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
