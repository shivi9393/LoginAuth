/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#05060f',
          800: '#0a0b1e',
          700: '#0f1230',
          600: '#161a44',
        },
        neon: {
          violet: '#8b5cf6',
          indigo: '#6366f1',
          cyan: '#22d3ee',
          pink: '#ec4899',
          mint: '#34d399',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(139,92,246,0.55)',
        'glow-cyan': '0 0 40px -8px rgba(34,211,238,0.55)',
        card: '0 30px 80px -20px rgba(0,0,0,0.65)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
