import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import LeadForm from "@/components/home/LeadForm"

export const metadata = {
  title: "Solar Subsidy in Uttar Pradesh | Complete Assistance",
  description: "Get up to 78,000 INR subsidy on solar panels in UP. We handle all PM Surya Ghar Yojana paperwork for you.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-6">Solar Subsidy in Uttar Pradesh</h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">Take advantage of the PM Surya Ghar Muft Bijli Yojana. We provide end-to-end support for applying and claiming your UP Solar Subsidy.</p>
        <div className="mt-12"><LeadForm /></div>
      </div>
      <FooterSection />
    </main>
  );
}
