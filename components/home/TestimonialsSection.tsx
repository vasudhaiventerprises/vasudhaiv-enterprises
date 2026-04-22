import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Swarnim Kushwaha",
      rating: 5,
      quote: "I recently had the pleasure of working with Vasudhaiv for a solar panel system on my home... I’m thrilled with how much my energy bills have decreased! Their exceptional service, product quality, and dedication to customer satisfaction make them a standout.",
      time: "a year ago"
    },
    {
      name: "Arvind Kumar",
      rating: 5,
      quote: "Best solar company in Lucknow. I am very glad I chose to go to this company. Customer friendly. They offer good prices. Highly recommended for everyone. 👍👍",
      time: "2 years ago"
    },
    {
      name: "Pratap Srivastava",
      rating: 5,
      quote: "Vasudhaiv Enterprises took up the turn-key assignment of fitment of grid based solar panel system at my house. They have seriously addressed all my concerns and have done a commendable job.",
      time: "2 years ago"
    },
    {
      name: "RAJNEESH KUMAR",
      rating: 5,
      quote: "A solar system was installed at my home by you, and I did not face any difficulties in any part of the process. You handled everything smoothly. Thank you so much.",
      time: "a year ago"
    },
    {
      name: "Vaibhav Srivastava",
      rating: 4,
      quote: "Good quality of solar panels and CCTV installation are provided by the owner.... A cost effective installation and flawless experience.",
      time: "2 years ago"
    },
    {
      name: "Uddish Verma",
      rating: 5,
      quote: "I personally recommend Vasudhaiv Enterprises for solar panels because their employee explained all the details thoroughly and exhibited very polite behavior.",
      time: "a year ago"
    },
    {
      name: "Hariom Maurya",
      rating: 4,
      quote: "This solar company is giving best work and affordable prices.",
      time: "7 months ago"
    },
    {
      name: "Viresh Tripathi",
      rating: 5,
      quote: "I am using Solar from last few years but not getting proper support from other Team then I decide the move with another vendor and pick the Vasudhaiv Enterprises. I must say the calmness while explaining the details is incredible.",
      time: "4 years ago"
    }
  ]

  // We duplicate the array to allow for a deeply continuous, gapless marquee effect
  const marqueeItems = [...testimonials, ...testimonials]

  return (
    <section className="py-32 bg-[#0a0f1c] relative overflow-hidden flex flex-col items-center">
      
      {/* Dark Solar Motif Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
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

      {/* Header */}
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
            <Star className="w-4 h-4 fill-emerald-400" />
            <span className="text-sm font-bold tracking-widest uppercase">Verified Google Reviews</span>
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Trusted by Thousands in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500">Uttar Pradesh</span>
          </h3>
          <p className="text-slate-400 text-lg">Swipe to read the real experiences of homeowners who switched to solar with our highly-rated team.</p>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="relative w-full max-w-[100vw] overflow-hidden z-10 group py-4">
        {/* Fading Edges for the marquee */}
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#0a0f1c] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#0a0f1c] to-transparent z-20 pointer-events-none"></div>

        <div className="flex w-max gap-6 scroll-marquee pr-6">
          {marqueeItems.map((t, i) => (
            <div 
              key={i} 
              className="glass-card flex-shrink-0 w-[350px] md:w-[420px] bg-slate-800/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl relative flex flex-col transition-all duration-300 hover:bg-slate-800/80 hover:border-emerald-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]"
            >
              {/* Google Brand Color Accents */}
              <div className="absolute top-0 right-10 w-20 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-b-md opacity-30"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className={`w-5 h-5 ${idx < t.rating ? "fill-amber-400" : "fill-slate-600"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-800/80 px-2 py-1 rounded-md">{t.time}</span>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed font-light flex-grow">"{t.quote}"</p>
              
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center text-white font-black text-lg shadow-inner">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white tracking-wide">{t.name}</h4>
                  <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
