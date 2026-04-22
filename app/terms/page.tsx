import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TermsPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-slate-900/50 border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        <h1 className="text-4xl font-black text-white mb-4">Terms and Conditions</h1>
        <p className="text-primary-400 font-bold mb-10 tracking-widest uppercase text-xs">Vasudhaiv Enterprises • Allahabad, UP</p>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 text-sm">1</span>
              Acceptance of Terms
            </h2>
            <p>By visiting our website, submitting a lead form, contacting us via WhatsApp or phone, or using our client portal, you agree to these Terms and Conditions in full. If you do not agree, please do not use our website or services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 text-sm">2</span>
              About Vasudhaiv Enterprises
            </h2>
            <p>Vasudhaiv Enterprises provides solar energy installation, annual maintenance contracts (AMC), rooftop surveys, grid-tied system setup, CCTV systems, and water purification solutions across residential, commercial, and institutional sectors in Prayagraj, Allahabad, and surrounding areas of Uttar Pradesh.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 text-sm">3</span>
              Service Information and Pricing Disclaimer
            </h2>
            <p>All information on this website regarding pricing, ROI calculations, and payback period projections is indicative only. Final quotations are provided only after a physical or virtual site survey by our engineers. Payback periods depend on your slab rate and usage patterns.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 text-sm">4</span>
              Government Subsidy Disclaimer
            </h2>
            <p>Eligibility for MNRE rooftop solar subsidies depends on government policy in effect at the time of application. Vasudhaiv Enterprises assists in documentation but does not guarantee subsidy approval or timelines. Rejection or delay by DISCOM/Authorities is not the liability of Vasudhaiv Enterprises.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 text-sm">5</span>
              Intellectual Property
            </h2>
            <p>All content on this website including text, design, logo, graphics, and code is the property of Vasudhaiv Enterprises. No part may be copied, reproduced, or distributed without prior written consent.</p>
          </section>

          <div className="pt-10 border-t border-white/5 mt-20">
             <p className="text-sm text-slate-500">Last Updated: June 2025</p>
             <p className="text-sm text-slate-500 mt-2">Contact: info@vasudhaivsolar.com | +91 8840315311</p>
          </div>
        </div>
      </div>
    </div>
  );
}
