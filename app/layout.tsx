import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StickyContact from "@/components/layout/StickyContact"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#f59e0b",
}

export const metadata: Metadata = {
  title: "Vasudhaiv Enterprises",
  description: "Solar Business App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <StickyContact />
      </body>
    </html>
  )
}
