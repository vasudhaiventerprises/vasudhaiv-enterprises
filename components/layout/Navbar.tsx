"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
      isScrolled 
        ? "bg-slate-900/80 backdrop-blur-lg border-white/10 py-3 shadow-2xl shadow-black/20" 
        : "bg-transparent border-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-white flex items-center gap-3 group">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
            ☀️
          </span>
          <span className="tracking-tight">Vasudhaiv Solar</span>
        </Link>

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
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute w-full left-0 top-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 py-6 px-6 flex flex-col gap-4 shadow-2xl">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white">Home</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white">Services</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white">Contact</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-4 text-center py-3 bg-primary-500 text-white font-bold rounded-xl">
            Client Portal
          </Link>
        </div>
      )}
    </nav>
  )
}
