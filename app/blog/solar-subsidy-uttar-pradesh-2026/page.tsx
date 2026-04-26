import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"

export const metadata = {
  title: "Solar Subsidy in Uttar Pradesh 2026 | Complete Guide",
  description: "Check latest rooftop solar subsidy in Uttar Pradesh 2026 and eligibility details for residential solar installation.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32 prose prose-invert">
        <h1 className="text-4xl font-bold text-emerald-400 mb-6">Solar Subsidy in Uttar Pradesh (2026 Update)</h1>
        <p className="text-lg text-slate-300">The PM Surya Ghar Yojana provides significant financial relief for homeowners looking to install solar panels in Uttar Pradesh. Here is your complete guide for 2026.</p>
        <h2>Subsidy Percentages & Amounts</h2>
        <ul>
          <li>1 kW: ₹30,000</li>
          <li>2 kW: ₹60,000</li>
          <li>3 kW & above: ₹78,000</li>
        </ul>
        <h2>Eligibility Requirements</h2>
        <p>You must own the property, have a valid electricity connection, and sufficient shadow-free rooftop space.</p>
        <h2>Application Process</h2>
        <p>Our team handles the entire national portal registration, site inspection scheduling, and net-metering approvals for you.</p>
      </div>
      <FooterSection />
    </main>
  );
}
