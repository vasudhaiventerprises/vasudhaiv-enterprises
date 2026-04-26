import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import ServiceFaqSchema from "@/components/ServiceFaqSchema"

export const metadata = {
  title: "Solar Panel Installation in Prayagraj | Rooftop Solar Experts",
  description: "Get affordable solar panel installation in Prayagraj with government subsidy support. Residential and commercial rooftop solar solutions by Vasudhaiv Enterprises.",
};

export default function Page() {
  return (
    <>
      <ServiceFaqSchema />
      <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32 prose prose-invert prose-emerald">
        <h1 className="text-3xl font-bold">Solar Panel Installation in Prayagraj</h1>
        <p className="mt-4">Vasudhaiv Enterprises provides complete solar panel installation in Prayagraj for homes, shops, schools, hospitals, and factories. Our rooftop solar systems help reduce electricity bills by up to 90% while increasing long-term property value and energy independence.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Why Install Solar Panels in Prayagraj?</h2>
        <p>Prayagraj receives strong sunlight throughout the year, making rooftop solar installation one of the smartest investments for residential and commercial buildings. With rising electricity costs, solar energy offers a reliable and affordable long-term solution.</p>
        <ul className="list-disc ml-6">
          <li>Reduce electricity bills drastically</li>
          <li>Government subsidy available for homes</li>
          <li>25-year panel performance warranty</li>
          <li>Environment-friendly clean energy</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Solar System Cost in Prayagraj</h2>
        <p>The cost of rooftop solar installation depends on system capacity such as 1kW, 2kW, 3kW, or 5kW. Smaller homes usually install 1kW–3kW systems, while larger homes and commercial buildings prefer higher-capacity installations.</p>
        <p>Our engineers provide free rooftop surveys and detailed cost estimates before installation.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Government Solar Subsidy in Uttar Pradesh</h2>
        <p>Residential solar systems qualify for central government rooftop solar subsidy schemes. Vasudhaiv Enterprises supports customers throughout the subsidy application and approval process, ensuring a smooth installation experience.</p>
        
        <h2 className="mt-6 text-xl font-semibold">Our Solar Installation Process</h2>
        <ul className="list-disc ml-6">
          <li>Free rooftop feasibility survey</li>
          <li>Customized system design</li>
          <li>Subsidy documentation assistance</li>
          <li>Professional installation</li>
          <li>Net-metering support</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Why Choose Vasudhaiv Enterprises?</h2>
        <ul className="list-disc ml-6">
          <li>Experienced solar installation engineers</li>
          <li>High-efficiency panels</li>
          <li>Fast installation timeline</li>
          <li>Affordable pricing</li>
          <li>Reliable after-sales service</li>
        </ul>
        
        <h2 className="mt-6 text-xl font-semibold">Book Your Free Solar Survey Today</h2>
        <p>Contact Vasudhaiv Enterprises today for expert rooftop solar panel installation in Prayagraj. Our team will design the best solar solution based on your electricity usage and roof size.</p>
      </div>
      <FooterSection />
    </main>
    </>
  );
}
