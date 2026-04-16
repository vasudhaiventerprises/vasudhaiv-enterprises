import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import FooterSection from '@/components/layout/FooterSection'
import LeadForm from '@/components/home/LeadForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: "Contact Vasudhaiv Enterprises | Solar Allahabad",
  description: "Contact us for solar panel installation, AMC, and consulting in Allahabad and Prayagraj.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1c] flex flex-col relative overflow-hidden">
      
      {/* Dark Solar Background Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[50rem] h-[50rem] bg-amber-500/10 rounded-full blur-[130px] mix-blend-screen"></div>
      </div>
      
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-16 relative z-10 flex-grow">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 pt-8">Let's Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500">Solar Future</span></h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Ready to dramatically reduce your electricity bills? Reach out to our engineering team for a free rooftop assessment and custom ROI report.
          </p>
        </div>
        
        {/* Contact Info & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          
          <div className="glass-card bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 text-white">Direct Contact</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Call & WhatsApp</h4>
                  <a href="tel:+918840315311" className="block text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                    +91 88403 15311
                  </a>
                  <a href="tel:+918181938584" className="block text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                    +91 81819 38584
                  </a>
                </div>
              </div>

                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Email Support</h4>
                    <a href="mailto:vasudhaivaenterprises@gmail.com" className="text-slate-300 hover:text-amber-400 transition-colors font-medium block text-sm">
                      vasudhaivaenterprises@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Head Office</h4>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      615/395 Shri, Sitapur Road<br/>
                      Gayatri Nagar, Lucknow<br/>
                      Uttar Pradesh 226021, India
                    </p>
                  </div>
                </div>
              
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Business Hours</h4>
                  <p className="text-slate-300">
                    Mon – Sat: 9 AM – 6 PM<br/>Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl h-full min-h-[300px] border border-white/10 relative group bg-slate-900">
            <iframe 
              src="https://maps.google.com/maps?q=615/395+Shri,+Sitapur+Road,+Gayatri+Nagar,+Lucknow,+Uttar+Pradesh+226021&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(80%)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Vasudhaiv Enterprises Location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Embedded LeadForm seamlessly spans full width */}
      <div className="border-t border-white/5 relative z-10">
        <LeadForm />
      </div>
      
      <FooterSection />
    </main>
  )
}
