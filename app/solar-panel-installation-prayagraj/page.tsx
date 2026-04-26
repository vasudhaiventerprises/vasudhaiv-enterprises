import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import LeadForm from "@/components/home/LeadForm"

export const metadata = {
  title: "Solar Panel Installation in Prayagraj | Rooftop Solar Experts",
  description: "Get affordable solar panel installation in Prayagraj with subsidy assistance. Vasudhaiv Enterprises provides residential and commercial rooftop solar solutions.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-6">
          Solar Panel Installation in Prayagraj
        </h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Vasudhaiv Enterprises provides complete rooftop solar panel installation services in Prayagraj for homes, shops, schools, hospitals and factories.
        </p>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="mt-6 text-2xl font-semibold mb-4 text-white">Benefits of Installing Solar</h2>
            <ul className="list-disc ml-6 text-slate-300 space-y-2">
              <li>Reduce electricity bill up to 90%</li>
              <li>Government subsidy available</li>
              <li>25+ year panel life</li>
            </ul>
            <h2 className="mt-10 text-2xl font-semibold mb-4 text-white">Solar Installation Cost in Prayagraj</h2>
            <p className="text-slate-300">
              Cost depends on system size like 1kW, 2kW, 3kW or 5kW rooftop solar installation. Contact us for exact pricing.
            </p>
          </div>
          <div>
            <LeadForm />
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}
