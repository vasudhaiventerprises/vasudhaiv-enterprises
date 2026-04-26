import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import StickyContact from "@/components/layout/StickyContact"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#f59e0b",
}

export const metadata: Metadata = {
  title: "Solar Installation in Allahabad | Vasudhaiv Enterprises",
  description: "Affordable and reliable solar panel solutions in Prayagraj & UP. Free rooftop survey, 5-year warranty, and instant savings on electricity bills.",
  manifest: "/manifest.json",
  icons: {
    apple: "/logo.png",
  },
  openGraph: {
    title: "Vasudhaiv Enterprises | Solar Energy Experts",
    description: "Switch to Solar and save on every electricity bill. Trusted in Allahabad.",
    images: ["/og-image.jpg"],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-JXHP611P2N`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JXHP611P2N');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <StickyContact />
      </body>
    </html>
  )
}
