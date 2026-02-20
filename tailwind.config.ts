import type { Config } from "tailwindcss";
// import scrollbarHide from 'tailwind-scrollbar-hide';
import { CONFIG } from "./src/config";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        steam: {
          DEFAULT: "#a8a29e",
          muted: "#78716c",
          bg: "#050505",
          panel: "#0c0c0c",
          border: "#1a1a1a",
          "border-light": "#262626",
          text: "#fafafa",
          "text-muted": "#a1a1aa",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        display: ['var(--font-display)', 'monospace'],
      },
      keyframes: {
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.9' },
          '66%': { opacity: '0.95' },
          '35%': { transform: 'translate(0, 1px)' },
          '70%': { transform: 'translate(0, -1px)' }
        },
        'slice': {
          '0%, 100%': { clipPath: 'inset(0 0 0 0)' },
          '10%': { clipPath: 'inset(10% 0 90% 0)' },
          '15%': { clipPath: 'inset(80% 0 5% 0)' },
          '20%': { clipPath: 'inset(30% 0 60% 0)' },
          '25%': { clipPath: 'inset(0 0 0 0)' },
          '75%': { clipPath: 'inset(0 0 0 0)' }
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        pulse: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 15px rgba(139,115,85,0.5)' },
          '50%': { opacity: '.8', textShadow: '0 0 10px rgba(139,115,85,0.3)' }
        },
        'flicker-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' }
        },
        'type': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'morph-out': {
          '0%, 45%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' }
        },
        'morph-in': {
          '0%, 45%': { opacity: '0', transform: 'translateY(10px)' },
          '50%': { opacity: '0', transform: 'translateY(10px)' },
          '55%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scramble': {
          '0%, 40%': { opacity: '1' },
          '60%': { opacity: '0' },
          '100%': { opacity: '0' }
        },
        'title-in': {
          '0%, 50%': { opacity: '0', filter: 'blur(10px)' },
          '60%, 70%': { opacity: '0.7', filter: 'blur(5px)' },
          '100%': { opacity: '1', filter: 'blur(0)' }
        },
        'char-scramble': {
          '0%, 10%': { content: '0' },
          '10.1%, 20%': { content: '1' },
          '20.1%, 30%': { content: 'F' },
          '30.1%, 40%': { content: '8' },
          '40.1%, 50%': { content: 'A' }
        },
        'new-row': {
          '0%': { color: '#ffffff' },
          '90%': { color: '#ffffff' },
          '100%': { color: '#8b7355' }
        },
        'new-entry': {
          '0%, 80%': { color: '#737373' },
          '81%, 100%': { color: '#8b7355' }
        }
      },
      animation: {
        'flicker': 'flicker 2s infinite',
        'slice': 'slice 3s infinite',
        'blink': 'blink 1s step-end infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scramble': 'scramble 2s ease-out forwards',
        'title-in': 'title-in 2s ease-out forwards',
        'char-1': 'char-scramble 0.5s steps(1) 5',
        'char-2': 'char-scramble 0.5s steps(1) 5 0.1s',
        'char-3': 'char-scramble 0.5s steps(1) 5 0.2s',
        'char-4': 'char-scramble 0.5s steps(1) 5 0.3s',
        'char-5': 'char-scramble 0.5s steps(1) 5 0.4s',
        'char-6': 'char-scramble 0.5s steps(1) 5 0.5s',
        'char-7': 'char-scramble 0.5s steps(1) 5 0.6s',
        'char-8': 'char-scramble 0.5s steps(1) 5 0.7s',
        'new-row': 'new-row .5s ease-out forwards',
        'new-entry': `new-entry ${CONFIG.NEW_ENTRY_DELAY_MS}s steps(1) forwards`
      },
      backgroundImage: {
        'scanlines': 'repeating-linear-gradient(0deg, rgba(115,115,115,0.06), rgba(115,115,115,0.06) 1px, transparent 1px, transparent 2px)'
      },
      backgroundSize: {
        'scanlines': '100% 4px',
      }
    },
  },
  plugins: [
    // scrollbarHide
  ],
} satisfies Config;
