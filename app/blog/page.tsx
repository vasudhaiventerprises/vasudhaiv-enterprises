import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import Link from "next/link"

export const metadata = {
  title: "Solar Energy Blog | Vasudhaiv Enterprises",
  description: "Read the latest updates on solar panel installation, rooftop solar subsidies, and renewable energy in Uttar Pradesh.",
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-bold text-emerald-400 mb-6">Latest Solar Insights & Guides</h1>
        <p className="text-lg text-slate-300 mb-12">Learn everything you need to know about switching to solar energy in Uttar Pradesh.</p>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Featured Article */}
          <Link href="/blog/solar-subsidy-uttar-pradesh-2026" className="block bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-8 transition-all group">
            <div className="text-emerald-400 font-mono text-sm mb-3">Govt Scheme Update • 5 Min Read</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Solar Subsidy in Uttar Pradesh (2026 Update)</h2>
            <p className="text-slate-400 mb-6">The PM Surya Ghar Yojana provides significant financial relief for homeowners looking to install solar panels in UP. Here is your complete guide.</p>
            <span className="text-emerald-400 font-medium inline-flex items-center gap-2">
              Read Article <span>→</span>
            </span>
          </Link>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}
