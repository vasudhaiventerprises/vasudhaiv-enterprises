import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import ServiceFaqSchema from "@/components/ServiceFaqSchema"

export const metadata = {
  title: "Solar Subsidy in Uttar Pradesh 2026 | Rooftop Solar Scheme Guide",
  description: "Check latest rooftop solar subsidy in Uttar Pradesh for residential homes. Eligibility, benefits and application support by Vasudhaiv Enterprises.",
};

export default function Page() {
  return (
    <>
      <ServiceFaqSchema />
      <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32 prose prose-invert prose-emerald">
        <h1 className="text-3xl font-bold">Solar Subsidy in Uttar Pradesh 2026</h1>
        <p className="mt-4">The Government of India provides rooftop solar subsidy support for residential solar installations across Uttar Pradesh including Prayagraj. This reduces the upfront installation cost significantly for homeowners.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Who Can Apply for Solar Subsidy?</h2>
        <ul className="list-disc ml-6">
          <li>Residential homeowners</li>
          <li>Independent houses</li>
          <li>Eligible rooftop structures</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Subsidy Benefits</h2>
        <p>Residential rooftop solar systems between 1kW and 3kW receive the highest subsidy support under current government programs.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Documents Required</h2>
        <ul className="list-disc ml-6">
          <li>Electricity bill</li>
          <li>Aadhar card</li>
          <li>Property ownership proof</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">How Vasudhaiv Enterprises Helps</h2>
        <p>Our team supports customers in Prayagraj throughout the subsidy registration process, documentation submission and installation approval workflow.</p>
      </div>
      <FooterSection />
    </main>
    </>
  );
}
