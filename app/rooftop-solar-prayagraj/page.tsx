import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import LeadForm from "@/components/home/LeadForm"

export const metadata = {
  title: "Rooftop Solar in Prayagraj | Best Solar Company",
  description: "Switch to rooftop solar in Prayagraj. Expert installation, tier-1 panels, and net-metering support for residential and commercial spaces.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-6">Rooftop Solar Solutions in Prayagraj</h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">Top-rated rooftop solar installation in Prayagraj with seamless net-metering and fast govt subsidy processing.</p>
        <div className="mt-12"><LeadForm /></div>
      </div>
      <FooterSection />
    </main>
  );
}
