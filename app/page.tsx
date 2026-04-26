import HeroSection from "@/components/home/HeroSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import LeadForm from "@/components/home/LeadForm"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
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
      <TestimonialsSection />
      <FooterSection />
    </main>
  )
}
