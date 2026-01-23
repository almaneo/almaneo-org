/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cold (기술/AI)
        'neos-blue': '#0052FF',
        'neos-cyan': '#06b6d4',
        'neos-navy': '#0A0F1A',
        'deep-navy': {
          DEFAULT: '#0A0F1A',
          50: '#1e293b',
          100: '#334155',
          200: '#475569',
        },
        // Warm (인간/정)
        'jeong-orange': '#FF6B00',
        'sand-gold': '#d4a574',
        'soft-beige': '#d4c4b0',
        // Semantic
        success: '#4ade80',
        warning: '#facc15',
        error: '#f87171',
        info: '#60a5fa',
      },
      fontFamily: {
        sans: ['Pretendard', 'Montserrat', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        korean: ['Pretendard', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'glow-blue': 'glow-blue 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 0, 0.5)' },
        },
        'glow-blue': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 82, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 82, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neos': 'linear-gradient(135deg, #0052FF 0%, #FF6B00 100%)',
        'gradient-cold': 'linear-gradient(135deg, #0052FF 0%, #06b6d4 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B00 0%, #d4a574 100%)',
      },
    },
  },
  plugins: [],
}
