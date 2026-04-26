import { Phone, Mail, MessageCircle, MapPin, Globe, Video, Map } from "lucide-react"
import Link from "next/link"
import Logo from "../shared/Logo"

export default function FooterSection() {
  return (
    <footer className="bg-slate-900 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
        <div className="md:col-span-5 lg:col-span-4">
          <Logo className="mb-6 block" />
          <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
            Government certified grid-connected solar energy plants with net metering. <br/><br/>
            <strong>Service Area:</strong> Serving all major cities and districts across Uttar Pradesh.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/vasudhaiventerprises" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
            </a>
            <a href="https://www.youtube.com/@vasudhaiventerprises" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://maps.app.goo.gl/cr9Duk49SBLSmCPR6" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
              <MapPin size={18} />
            </a>
          </div>
        </div>
        
        <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
          <h4 className="text-white font-bold mb-6 tracking-wide">Quick Links</h4>
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/services" className="text-slate-400 hover:text-white transition-colors">Services</Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">Client Portal</Link>
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-4 gap-4">
          <h4 className="text-white font-bold mb-6 tracking-wide">Contact Us</h4>
          <div className="flex flex-col gap-5">
            <a href="https://maps.app.goo.gl/cr9Duk49SBLSmCPR6" target="_blank" rel="noreferrer" className="flex gap-4 text-slate-400 items-start hover:text-white transition-colors">
              <MapPin size={20} className="text-emerald-500 shrink-0 mt-1"/>
              <span>Find us on Google Maps<br/>615/395 Shri, Sitapur Road<br/>Gayatri Nagar, Lucknow</span>
            </a>
            <a href="tel:+918840315311" className="flex gap-4 text-slate-400 items-center hover:text-white transition-colors">
              <Phone size={20} className="text-emerald-500 shrink-0"/>
              <span>+91 8840315311</span>
            </a>
            <a href="https://wa.me/918840315311" target="_blank" rel="noreferrer" className="flex gap-4 text-slate-400 items-center hover:text-white transition-colors mt-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full inline-flex gap-2 font-medium text-sm border border-emerald-500/30 w-fit items-center">
                <MessageCircle size={16} /> WhatsApp Us
              </span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vasudhaiv Enterprises. All rights reserved.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
            <Link href="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/solar-subsidy-disclaimer" className="hover:text-slate-400">Subsidy Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
