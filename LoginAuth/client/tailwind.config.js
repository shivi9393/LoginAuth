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
        // deep Pandora-night jungle base
        ink: {
          900: '#03110c',
          800: '#05180f',
          700: '#082218',
          600: '#0c2e21',
        },
        // bioluminescent accents (key names kept stable; values are jungle glow)
        neon: {
          violet: '#2dd4bf', // teal — primary glow
          indigo: '#10b981', // emerald — deep glow
          cyan: '#22d3ee', // bio cyan
          pink: '#e879f9', // fuchsia bloom
          mint: '#a3e635', // lime pollen
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(45,212,191,0.55)',
        'glow-cyan': '0 0 40px -8px rgba(34,211,238,0.55)',
        card: '0 30px 80px -20px rgba(0,0,0,0.7)',
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
        drift: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-10px) translateX(6px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
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
        drift: 'drift 9s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
