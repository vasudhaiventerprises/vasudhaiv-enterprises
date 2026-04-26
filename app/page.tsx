import HeroSection from "@/components/home/HeroSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import LeadForm from "@/components/home/LeadForm"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import FaqSchema from "@/components/FaqSchema"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solar Panel Installation in Prayagraj | Vasudhaiv Enterprises",
  description: "Affordable solar panel installation in Prayagraj with government subsidy support. Residential and commercial rooftop solar solutions by Vasudhaiv Enterprises.",
  keywords: "solar installation Prayagraj, solar company Allahabad, rooftop solar Prayagraj, home solar system Prayagraj, solar subsidy UP",
  alternates: {
    canonical: "https://www.vasudhaiventerprises.in"
  },
  openGraph: {
    title: "Solar Panel Installation in Uttar Pradesh | Vasudhaiv Enterprises",
    description: "Best solar panel installation in Uttar Pradesh. Govt-certified grid-connected solar power plants. Save big on bills.",
    url: "https://vasudhaivsolar.com",
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
          <p className="text-slate-400 text-lg leading-relaxed">
            Vasudhaiv Enterprises is a trusted <strong className="text-emerald-400 font-medium">solar company in Allahabad</strong> providing 
            <strong className="text-emerald-400 font-medium"> rooftop solar installation in Prayagraj</strong> for homes, shops, 
            institutions and factories across the region with full <strong className="text-emerald-400 font-medium">solar subsidy UP</strong> support.
          </p>
        </div>
      </section>

      <ServicesSection />
      <WhyUsSection />
      <LeadForm />

      {/* Visible FAQ Section */}
      <section className="py-16 bg-slate-900 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-emerald-400 text-center">
            Frequently Asked Questions – Solar Installation in Prayagraj
          </h2>

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors">
              <h3 className="font-semibold text-white text-lg mb-2">What is the cost of solar panel installation in Prayagraj?</h3>
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
