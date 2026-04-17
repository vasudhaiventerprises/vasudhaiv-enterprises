"use client"
import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  }

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform`}>
        <img 
          src="/logo.png" 
          alt="Vasudhaiv Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // If image fails, replace with SVG fallback
            e.currentTarget.style.display = 'none';
            const svg = e.currentTarget.nextElementSibling as HTMLElement;
            if (svg) svg.style.display = 'block';
          }}
        />
        <svg viewBox="0 0 24 24" className={`${iconSizes[size]} text-emerald-500 drop-shadow-md hidden`} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l2-2m-2 2l-2-2m2 2l2 2m-2-2l-2 2" />
        </svg>
      </div>
      {showText && (
        <span className={`${size === 'lg' ? 'text-3xl' : 'text-2xl'} font-black text-white tracking-tight`}>
          Vasudhaiv<span className="text-white/70">Solar</span>
        </span>
      )}
    </Link>
  )
}
