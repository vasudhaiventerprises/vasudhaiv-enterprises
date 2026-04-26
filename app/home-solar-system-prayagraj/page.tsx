import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import LeadForm from "@/components/home/LeadForm"

export const metadata = {
  title: "Home Solar System in Prayagraj | Residential Solar Panels",
  description: "Install a 2kW, 3kW, or 5kW home solar system in Prayagraj. Enjoy zero electricity bills with premium panels and expert installation.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-6">Home Solar Systems in Prayagraj</h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">Empower your home with sustainable solar energy. We specialize in residential setups ranging from 1kW to 10kW.</p>
        <div className="mt-12"><LeadForm /></div>
      </div>
      <FooterSection />
    </main>
  );
}
