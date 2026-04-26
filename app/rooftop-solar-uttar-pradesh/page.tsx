import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import ServiceFaqSchema from "@/components/ServiceFaqSchema"

export const metadata = {
  title: "Rooftop Solar Installation in Uttar Pradesh | Home & Commercial Solar",
  description: "Install rooftop solar panels in Uttar Pradesh and reduce electricity bills up to 90%. Get subsidy-supported solar installation from Vasudhaiv Enterprises.",
};

export default function Page() {
  return (
    <>
      <ServiceFaqSchema />
      <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32 prose prose-invert prose-emerald">
        <h1 className="text-3xl font-bold">Rooftop Solar Installation in Uttar Pradesh</h1>
        <p className="mt-4">Rooftop solar installation in Uttar Pradesh is one of the most effective ways to reduce electricity costs and achieve long-term energy savings. Vasudhaiv Enterprises provides customized rooftop solar systems for homes, offices, schools and commercial buildings across Uttar Pradesh.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Benefits of Rooftop Solar Systems</h2>
        <ul className="list-disc ml-6">
          <li>Reduce electricity bills up to 90%</li>
          <li>Low maintenance requirements</li>
          <li>25-year performance warranty</li>
          <li>Increase property value</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Suitable Buildings for Rooftop Solar</h2>
        <p>Rooftop solar systems can be installed on residential houses, commercial shops, institutions and factories in Uttar Pradesh depending on available roof space and electricity consumption.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Rooftop Solar Installation Process</h2>
        <ul className="list-disc ml-6">
          <li>Site inspection</li>
          <li>System capacity planning</li>
          <li>Government subsidy support</li>
          <li>Professional installation</li>
          <li>Net-metering assistance</li>
        </ul>
        
        <p className="mt-6">Contact Vasudhaiv Enterprises today to install rooftop solar panels in Uttar Pradesh with expert technical support.</p>
      </div>
      <FooterSection />
    </main>
    </>
  );
}
