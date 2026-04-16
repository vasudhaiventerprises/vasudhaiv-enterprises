import HeroSection from "@/components/home/HeroSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import LeadForm from "@/components/home/LeadForm"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import Navbar from "@/components/layout/Navbar"
import FooterSection from "@/components/layout/FooterSection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solar Panel Installation in Allahabad | Vasudhaiv Enterprises",
  description: "Best solar panel installation in Allahabad and Prayagraj. Free rooftop survey. 5-year warranty. Call +91XXXXXXXXXX",
  keywords: "solar panel allahabad, solar installation prayagraj, rooftop solar uttar pradesh, solar company allahabad",
  alternates: {
    canonical: "https://yourdomain.in"
  },
  openGraph: {
    title: "Solar Panel Installation in Allahabad | Vasudhaiv Enterprises",
    description: "Best solar panel installation in Allahabad and Prayagraj. Free rooftop survey. 5-year warranty. Call +91XXXXXXXXXX",
    url: "https://yourdomain.in",
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
