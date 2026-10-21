import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        head: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#08080d',
          2: '#0e0e16',
          3: '#13131e',
          4: '#191926',
          5: '#1f1f30',
        },
        gold: {
          DEFAULT: '#c9a84c',
          2: '#e2c06a',
          3: '#f0d898',
          dim: 'rgba(201,168,76,0.12)',
          glow: 'rgba(201,168,76,0.25)',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          2: '#a78bfa',
          dim: 'rgba(139,92,246,0.12)',
        },
        ink: {
          DEFAULT: '#edeae4',
          2: '#9b9488',
          3: '#625e58',
        },
        border: {
          DEFAULT: 'rgba(201,168,76,0.12)',
          2: 'rgba(201,168,76,0.25)',
          3: 'rgba(201,168,76,0.4)',
        },
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(201,168,76,0.09) 0%, transparent 65%)',
        'gold-gradient': 'linear-gradient(135deg, #c9a84c, #f0d898)',
        'purple-gradient': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        'card-hover': 'linear-gradient(135deg, rgba(201,168,76,0.08), transparent 60%)',
      },
      boxShadow: {
        gold: '0 0 40px rgba(201,168,76,0.2)',
        'gold-lg': '0 8px 32px rgba(201,168,76,0.45)',
        card: '0 4px 24px rgba(0,0,0,0.5)',
        'card-lg': '0 8px 48px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-down': 'fadeDown 0.5s ease both',
        'float': 'float 12s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-30px)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 8px 40px rgba(139,92,246,0.4)' },
          '50%':     { boxShadow: '0 8px 60px rgba(139,92,246,0.65)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
