import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import ServiceFaqSchema from "@/components/ServiceFaqSchema"

export const metadata = {
  title: "Commercial Solar Installation in Prayagraj | Factory & Business Solar",
  description: "Reduce business electricity costs with commercial solar installation in Prayagraj. Expert solar solutions by Vasudhaiv Enterprises.",
};

export default function Page() {
  return (
    <>
      <ServiceFaqSchema />
      <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32 prose prose-invert prose-emerald">
        <h1 className="text-3xl font-bold">Commercial Solar Installation in Prayagraj</h1>
        <p className="mt-4">Commercial solar installation helps businesses in Prayagraj reduce operating costs and improve sustainability. Vasudhaiv Enterprises designs customized solar systems for factories, schools, hospitals, offices and retail spaces.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Benefits for Businesses</h2>
        <ul className="list-disc ml-6">
          <li>Reduce operational electricity expenses</li>
          <li>Increase long-term ROI</li>
          <li>Tax and depreciation benefits</li>
          <li>Reliable daytime power generation</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Ideal Commercial Solar Capacity</h2>
        <p>Commercial solar systems typically range between 5kW and 100kW depending on building size and electricity consumption.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Industries We Serve</h2>
        <ul className="list-disc ml-6">
          <li>Factories</li>
          <li>Schools & colleges</li>
          <li>Hospitals</li>
          <li>Retail shops</li>
          <li>Office buildings</li>
        </ul>
        
        <p className="mt-6">Contact Vasudhaiv Enterprises for commercial rooftop solar installation in Prayagraj with expert consultation.</p>
      </div>
      <FooterSection />
    </main>
    </>
  );
}
