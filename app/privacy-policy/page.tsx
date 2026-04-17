export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-slate-900/50 border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-emerald-400 font-bold mb-10 tracking-widest uppercase text-xs">Compliant with DPDPA 2023 • Vasudhaiv Enterprises</p>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Data We Collect</h2>
            <p>We collect personal information that you provide directly to us via lead forms, contact forms, or the client portal. This includes your name, mobile number, city, roof type, and energy requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Purpose of Collection</h2>
            <p>Your data is used exclusively to respond to inquiries, provide solar quotations, schedule surveys, and manage service requests. We do not sell or trade your data with third-party advertisers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Communication Consent</h2>
            <p>By submitting a form, you consent to receive callbacks, WhatsApp messages, and notifications related to your solar inquiry. You may opt-out of promotional messages at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
            <p>We implement Row-Level Security (RLS) on our databases and use encrypted connections (HTTPS) to ensure your information is protected. Only authorized staff and administrators have access to client data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
            <p>Under India's Digital Personal Data Protection Act (DPDPA) 2023, you have the right to access, correct, or request deletion of your personal data. Contact our grievance officer for any data-related requests.</p>
          </section>

          <div className="pt-10 border-t border-white/5 mt-20">
             <p className="text-sm text-slate-500">Last Updated: June 2025</p>
             <p className="text-sm text-slate-500 mt-2">Grievance Officer: info@vasudhaivsolar.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
