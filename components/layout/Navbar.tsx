"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Logo from "../shared/Logo"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-slate-900/90 backdrop-blur-md py-4 shadow-xl" : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Logo />
        
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Home</Link>
          <Link href="/services" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Services</Link>
          <Link href="/contact" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Contact</Link>
          <Link href="/login" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 text-white text-sm font-bold rounded-full transition-all backdrop-blur-md">
            Client Portal
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full left-0 top-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 py-6 px-6 flex flex-col gap-4 shadow-2xl">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Home</Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Services</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Contact</Link>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="mt-4 text-center py-3 bg-primary-500 text-white font-bold rounded-xl">
            Client Portal
          </Link>
        </div>
      )}
    </nav>
  )
}
