export default function WhyUsSection() {
  const points = [
    { title: "6+ Years Mastery", icon: "⭐", desc: "Proven track record in renewable energy deployment." },
    { title: "200+ Active Sites", icon: "🏢", desc: "Trusted by hundreds of homeowners and businesses." },
    { title: "25-Yr Performance", icon: "🛡️", desc: "Long-term panel guarantees for complete peace of mind." },
    { title: "Free Site Survey", icon: "📐", desc: "No-obligation engineering assessment." }
  ]

  return (
    <section className="py-32 relative overflow-hidden">
      
      {/* Immersive Transparent Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2058&auto=format&fit=crop" 
          alt="Field of solar panels" 
          className="w-full h-full object-cover object-bottom"
        />
        {/* Dark overlay to make the image act as a transparent background and keep text readable */}
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900/90"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Centered Header Content */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 inline-flex items-center justify-center gap-3">
            <span className="w-10 h-[2px] bg-emerald-500"></span>
            The Vasudhaiv Advantage
            <span className="w-10 h-[2px] bg-emerald-500"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Committed to Excellence & Sustainability
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
            We aren't just installers; we are energy lifecycle consultants. Our proprietary approach ensures you get the highest potential yield from your rooftop, mapping every solar cell to your exact energy profile.
          </p>
        </div>
        
        {/* Statistics Banner */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center gap-6 mb-16">
          <div className="glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-1/3 text-center transition-transform hover:-translate-y-1">
            <span className="block text-4xl font-black text-amber-400 mb-1">100%</span>
            <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">Energy Independence</span>
          </div>
          <div className="glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-1/3 text-center transition-transform hover:-translate-y-1">
            <span className="block text-4xl font-black text-emerald-400 mb-1">5 Yrs</span>
            <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">Installation Warranty</span>
          </div>
          <div className="glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-1/3 text-center transition-transform hover:-translate-y-1">
            <span className="block text-4xl font-black text-blue-400 mb-1">24h</span>
            <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">Response Time</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {points.map((point, index) => (
            <div key={index} className="flex gap-5 group items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 shadow-lg">
                {point.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-xl mb-2">{point.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
