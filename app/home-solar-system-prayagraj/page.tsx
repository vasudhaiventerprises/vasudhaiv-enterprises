import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import ServiceFaqSchema from "@/components/ServiceFaqSchema"

export const metadata = {
  title: "Home Solar System Installation in Prayagraj | Residential Solar Solutions",
  description: "Install residential solar panels in Prayagraj with subsidy benefits. Affordable home solar system installation by Vasudhaiv Enterprises.",
};

export default function Page() {
  return (
    <>
      <ServiceFaqSchema />
      <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32 prose prose-invert prose-emerald">
        <h1 className="text-3xl font-bold">Home Solar System Installation in Prayagraj</h1>
        <p className="mt-4">Residential solar systems are becoming increasingly popular in Prayagraj due to rising electricity prices. Installing a home solar system helps households reduce monthly electricity expenses while contributing to clean energy generation.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Recommended Solar System Sizes for Homes</h2>
        <ul className="list-disc ml-6">
          <li>1kW solar system for small homes</li>
          <li>2kW solar system for medium households</li>
          <li>3kW–5kW systems for large families</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Government Subsidy for Residential Solar</h2>
        <p>Homeowners in Prayagraj can apply for central government rooftop solar subsidy programs. Vasudhaiv Enterprises assists customers with the complete subsidy documentation and approval process.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Advantages of Installing Solar at Home</h2>
        <ul className="list-disc ml-6">
          <li>Lower electricity bills</li>
          <li>Backup energy independence</li>
          <li>Environment-friendly power generation</li>
          <li>Long-term savings for 25+ years</li>
        </ul>
        
        <p className="mt-6">Schedule a free rooftop survey today to install your residential solar system in Prayagraj.</p>
      </div>
      <FooterSection />
    </main>
    </>
  );
}
