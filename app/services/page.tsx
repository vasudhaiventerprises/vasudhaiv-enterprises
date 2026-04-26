import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import FooterSection from '@/components/layout/FooterSection'
import ServicesSection from '@/components/home/ServicesSection'

export const metadata: Metadata = {
  title: "Solar Panel Services in Uttar Pradesh | Vasudhaiv Enterprises",
  description: "Solar installation, AMC, rooftop survey services in Uttar Pradesh. Affordable packages. Call for free quote.",
  alternates: {
    canonical: "https://yourdomain.in/services"
  }
}

export default function ServicesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does a 3kW solar panel cost in Uttar Pradesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A 3kW solar system cost starts around ₹1,50,000 depending on the type of panels and inverter used. Contact us for a precise quote."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide solar AMC services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide Annual Maintenance Contracts starting at ₹5,000/year to keep your solar panels efficient."
        }
      }
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vasudhaiv Enterprises",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Uttar Pradesh",
      "addressRegion": "UP",
      "addressCountry": "IN"
    },
    "telephone": "+91XXXXXXXXXX",
    "url": "https://yourdomain.in"
  }

  return (
    <main className="min-h-screen pt-24 bg-gray-50">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="container mx-auto px-4 mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">Solar Services in Uttar Pradesh</h1>
        <ServicesSection />
      </div>
      
      <FooterSection />
    </main>
  )
}
