import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TradeMind Design System
        tm: {
          bg: "#0d0f14",
          s1: "#141720",
          s2: "#1c1f2e",
          s3: "#252840",
          border: "#2a2d40",
          text: "#d4d8f0",
          muted: "#666880",
          hint: "#444660",
          purple: "#9d7cf7",
          green: "#2dd4a0",
          red: "#f75c7c",
          amber: "#f7c948",
          blue: "#5b8dee",
        },
        background: "#0d0f14", // Updated to tm bg
        foreground: "#d4d8f0", // Updated to tm text
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          300: '#6ee7b7',
          500: '#2dd4a0', // TM green
          600: '#059669',
          900: '#064e3b',
        },
        accent: {
          50: '#fffbeb',
          400: '#fbbf24',
          500: '#9d7cf7', // TM purple
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right bottom, #141720, #1c1f2e, #0d0f14)',
        'glass-gradient': 'linear-gradient(135deg, rgba(45,212,160,0.05) 0%, #1c1f2e 60%)',
        'tm-card-glow': 'linear-gradient(135deg, rgba(157,124,247,0.1) 0%, rgba(20,23,32,1) 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20vw, -20vh) scale(1.2)' },
          '66%': { transform: 'translate(-10vw, 15vh) scale(0.8)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    },
  },
  plugins: [
    // require('@tailwindcss/typography'), // Temporarily disabled so npm run dev can start
  ],
};
export default config;
