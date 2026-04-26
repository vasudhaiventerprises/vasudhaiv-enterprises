import HeroSection from "@/components/home/HeroSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import LeadForm from "@/components/home/LeadForm"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import RoiCalculator from "@/components/home/RoiCalculator"
import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import FaqSchema from "@/components/FaqSchema"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solar Panel Installation in Uttar Pradesh | Vasudhaiv Enterprises",
  description: "Affordable solar panel installation in Uttar Pradesh with government subsidy support. Residential and commercial rooftop solar solutions by Vasudhaiv Enterprises.",
  keywords: "solar installation Uttar Pradesh, solar company UP, rooftop solar UP, home solar system UP, solar subsidy UP",
  alternates: {
    canonical: "https://www.vasudhaiventerprises.in"
  },
  openGraph: {
    title: "Solar Panel Installation in Uttar Pradesh | Vasudhaiv Enterprises",
    description: "Best solar panel installation in Uttar Pradesh. Govt-certified grid-connected solar power plants. Save big on bills.",
    url: "https://www.vasudhaiventerprises.in",
    type: "website",
    images: [{ url: "/og-image.jpg" }]
  },
  robots: "index, follow"
}

export default function Home() {
  return (
    <>
      <FaqSchema />
      <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <section className="py-12 bg-slate-900 border-b border-white/5">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Vasudhaiv Enterprises is a trusted <strong className="text-emerald-400 font-medium">solar company in Uttar Pradesh</strong> providing 
            <strong className="text-emerald-400 font-medium"> rooftop solar installation across UP</strong> for homes, shops, 
            institutions and factories with full <strong className="text-emerald-400 font-medium">government solar subsidy</strong> support.
          </p>
          
          {/* SEO Internal Link Cluster & Blog */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-6">
            <Link href="/solar-panel-installation-uttar-pradesh" className="bg-white/5 py-3 px-4 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 transition-colors border border-white/5 flex items-center justify-center">
              Solar Installation UP
            </Link>
            <Link href="/rooftop-solar-uttar-pradesh" className="bg-white/5 py-3 px-4 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 transition-colors border border-white/5 flex items-center justify-center">
              Rooftop Solar in UP
            </Link>
            <Link href="/home-solar-system-uttar-pradesh" className="bg-white/5 py-3 px-4 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 transition-colors border border-white/5 flex items-center justify-center">
              Home Solar System UP
            </Link>
            <Link href="/commercial-solar-installation-uttar-pradesh" className="bg-white/5 py-3 px-4 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 transition-colors border border-white/5 flex items-center justify-center">
              Commercial Solar Installation
            </Link>
            <Link href="/solar-subsidy-uttar-pradesh" className="bg-white/5 py-3 px-4 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 transition-colors border border-white/5 flex items-center justify-center">
              UP Solar Subsidy Guide
            </Link>
            <Link href="/blog/solar-subsidy-uttar-pradesh-2026" className="bg-emerald-500/10 py-3 px-4 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors border border-emerald-500/20 font-medium flex items-center justify-center">
              📝 Latest Blog Post
            </Link>
          </div>
        </div>
      </section>

      <ServicesSection />
      <WhyUsSection />
      <LeadForm />
      
      {/* Interactive Savings Calculator */}
      <section className="py-8 bg-[#0a0f1c] px-6">
        <RoiCalculator />
      </section>

      {/* Visible FAQ Section */}
      <section className="py-16 bg-slate-900 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-emerald-400 text-center">
            Frequently Asked Questions – Solar Installation in Uttar Pradesh
          </h2>

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors">
              <h3 className="font-semibold text-white text-lg mb-2">What is the cost of solar panel installation in Uttar Pradesh?</h3>
              <p className="text-slate-300">Solar installation cost depends on rooftop size and electricity usage. Contact Vasudhaiv Enterprises for a free site survey.</p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors">
              <h3 className="font-semibold text-white text-lg mb-2">Is government subsidy available?</h3>
              <p className="text-slate-300">Yes. Residential rooftop solar systems qualify for central government subsidy.</p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors">
              <h3 className="font-semibold text-white text-lg mb-2">How much electricity bill can solar reduce?</h3>
              <p className="text-slate-300">Solar systems can reduce electricity bills by up to 90%.</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FooterSection />
    </main>
    </>
  )
}
