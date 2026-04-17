import HeroSection from "@/components/home/HeroSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import LeadForm from "@/components/home/LeadForm"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solar Panel Installation in Uttar Pradesh | Vasudhaiv Enterprises",
  description: "Best solar panel installation in Uttar Pradesh. Get zero electricity bills with Govt-certified solar power plants. Call +91 9123456789.",
  keywords: "solar panel allahabad, solar installation prayagraj, rooftop solar uttar pradesh, solar company allahabad, solar subsidy up, zero electricity bill allahabad",
  alternates: {
    canonical: "https://vasudhaivsolar.com"
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
      <ServicesSection />
      <WhyUsSection />
      <LeadForm />
      <TestimonialsSection />
      <FooterSection />
    </main>
  )
}
