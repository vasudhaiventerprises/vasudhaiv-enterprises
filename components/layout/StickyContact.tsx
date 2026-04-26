import { MessageCircle, Phone } from "lucide-react"

export default function StickyContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">

      {/* WhatsApp */}
      <a 
        href={`https://wa.me/918840315311?text=${encodeURIComponent("Hello Vasudhaiv Enterprises, I want a free site visit for solar panel installation.")}`}
        target="_blank" 
        rel="noreferrer"
        className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#0a0f1c]"></span>
        </span>
      </a>
      
      {/* Phone Call */}
      <a 
        href="tel:+918840315311" 
        className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform md:hidden"
        aria-label="Call Now"
      >
        <Phone size={28} />
      </a>
    </div>
  )
}
