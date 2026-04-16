import Image from "next/image"

export default function SolarBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0f1c] selection:bg-none">
      
      {/* 1. High-Quality Solar Installation Background with Ken Burns Animation */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop"
          alt="Premium Solar Rooftop Installation"
          className="w-full h-full object-cover animate-[kenBurns_25s_ease-in-out_infinite_alternate]"
        />
      </div>

      {/* 2. Deep Gradient Overlays for Readability and Mood */}
      {/* Heavy vignette from edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0f1c_90%)] z-10 opacity-90"></div>
      {/* Dark gradient from bottom up to mask the bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#0a0f1c] to-transparent z-10"></div>
      {/* Emerald tint over the image to keep brand cohesion */}
      <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply z-10"></div>

      {/* 3. Glowing Orbs for "Energy" Feel (Reduced opacity to not overpower the image) */}
      <div className="absolute inset-0 z-10 opacity-30 mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-500/50 blur-[150px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/50 blur-[150px] animate-blob" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
      </div>

      {/* 4. Fast Passing Light Rays (Photons/Energy) */}
      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-60 z-20">
        <div className="absolute w-[200%] h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent blur-[1px] rotate-45 transform origin-left animate-pulse-slow" style={{ top: '-10%', left: '-20%', animationDuration: '2s' }}></div>
        <div className="absolute w-[200%] h-[5px] bg-gradient-to-r from-transparent via-white to-transparent blur-[3px] rotate-45 transform origin-left animate-pulse-slow" style={{ top: '30%', left: '-30%', animationDelay: '0.8s', animationDuration: '3s' }}></div>
        <div className="absolute w-[200%] h-[4px] bg-gradient-to-r from-transparent via-yellow-200 to-transparent blur-[3px] -rotate-45 transform origin-right animate-pulse-slow" style={{ bottom: '20%', right: '-30%', animationDelay: '1.5s', animationDuration: '2.5s' }}></div>
      </div>

    </div>
  )
}
