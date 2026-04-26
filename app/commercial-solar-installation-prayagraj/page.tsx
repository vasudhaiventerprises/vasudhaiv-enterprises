import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import LeadForm from "@/components/home/LeadForm"

export const metadata = {
  title: "Commercial Solar Installation in Prayagraj | Business Solar",
  description: "Reduce operational costs with commercial solar installation in Prayagraj. Custom solar plants for hospitals, factories, and schools.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-6">Commercial Solar Installation in Prayagraj</h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">Cut down overhead costs by installing heavy-duty commercial solar plants for your factory, school, or hospital.</p>
        <div className="mt-12"><LeadForm /></div>
      </div>
      <FooterSection />
    </main>
  );
}
