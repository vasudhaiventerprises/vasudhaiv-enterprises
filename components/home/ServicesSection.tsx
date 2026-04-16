export default function ServicesSection() {
  const services = [
    {
      title: "Solar Panel Installation",
      icon: "☀️",
      description: "End-to-end rooftop solar installation mapped to your energy profile.",
      price: "From ₹1,50,000",
      accent: "from-primary-400 to-primary-600"
    },
    {
      title: "Intelligent AMC",
      icon: "🔧",
      description: "Proactive maintenance ensuring peak efficiency year-round.",
      price: "From ₹5,000/yr",
      accent: "from-blue-400 to-blue-600"
    },
    {
      title: "Rooftop Survey",
      icon: "📐",
      description: "Drone-assisted mapping and accurate energy feasibility reporting.",
      price: "Complimentary",
      accent: "from-purple-400 to-purple-600"
    },
    {
      title: "Grid-Tied Systems",
      icon: "⚡",
      description: "Export surplus power to the grid and maximize ROI via net-metering.",
      price: "Custom Estimate",
      accent: "from-accent-400 to-accent-600"
    }
  ]

  return (
    <section className="py-32 bg-slate-900 relative overflow-hidden" id="services">
      {/* Solar Texture Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=2070&auto=format&fit=crop"
          alt="Solar Cell Texture"
          className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Engineered for Performance</h3>
          <p className="text-lg text-slate-300">
            State-of-the-art solar solutions designed to seamlessly integrate into your architecture and dramatically reduce your carbon footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 overflow-hidden"
            >
              {/* Hover Gradient Overlay */}
              <div className={`absolute top-0 left-0 w-full h-[3px] opacity-80 bg-gradient-to-r ${service.accent}`}></div>
              <div className={`absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 bg-gradient-to-br ${service.accent} transition-opacity duration-300 pointer-events-none`}></div>
              
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/5">
                {service.icon}
              </div>
              
              <h4 className="text-xl font-bold mb-3 text-white">{service.title}</h4>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm h-16">{service.description}</p>
              
              <div className="mt-auto">
                <span className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-slate-300 border border-white/5 font-semibold text-sm group-hover:text-white transition-colors duration-300">
                  {service.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
