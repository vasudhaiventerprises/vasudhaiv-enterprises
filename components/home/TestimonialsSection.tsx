export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      city: "Allahabad",
      rating: "⭐⭐⭐⭐⭐",
      quote: "My electricity bill dropped from ₹4,500 to almost ₹0 after installing a 3kW system. The Vasudhaiv team was professional and completed the installation perfectly."
    },
    {
      name: "Sandeep Mishra",
      city: "Prayagraj",
      rating: "⭐⭐⭐⭐⭐",
      quote: "Best solar company in UP! They did a free site survey and explained everything clearly. We went with a 5kW grid-tied system. Highly recommended."
    },
    {
      name: "Pooja Singh",
      city: "Allahabad",
      rating: "⭐⭐⭐⭐⭐",
      quote: "We were worried about panel cleaning, but their AMC service handles it all. Their post-installation support is very prompt."
    }
  ]

  return (
    <section className="py-32 bg-[#0a0f1c] relative overflow-hidden">
      
      {/* Dark Solar Motif Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-emerald-500">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-testimonials)" />
          <defs>
            <pattern id="grid-testimonials" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 inline-flex items-center gap-3">
            <span className="w-8 h-[2px] bg-emerald-500"></span>
            Client Success Stories
            <span className="w-8 h-[2px] bg-emerald-500"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white">What Our Community Says</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card bg-slate-800/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-2xl relative group hover:-translate-y-2 transition-all duration-300">
              {/* Glowing Quote Icon */}
              <div className="text-7xl absolute text-white/5 top-2 right-8 group-hover:text-amber-500/10 transition-colors font-serif leading-none">&quot;</div>
              
              <div className="mb-6 relative z-10 flex gap-1 text-amber-400 text-sm">
                {t.rating}
              </div>
              
              <p className="text-slate-300 mb-10 italic relative z-10 leading-relaxed min-h-[100px] text-lg font-light">&quot;{t.quote}&quot;</p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] text-xl border border- emerald-400/50">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{t.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
