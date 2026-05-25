/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        serif:   ['Fraunces', 'serif'],
        sans:    ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
        mono:    ['SF Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        glass: {
          white:  'rgba(255,255,255,0.12)',
          border: 'rgba(255,255,255,0.20)',
          heavy:  'rgba(255,255,255,0.22)',
          card:   'rgba(255,255,255,0.08)',
        },
        def: {
          accent: '#3D6B35',
          light:  '#5A9E4A',
          glow:   'rgba(61,107,53,0.35)',
        },
        str: {
          accent: '#C47B1A',
          light:  '#E09030',
          glow:   'rgba(196,123,26,0.35)',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '4px',
        '2xl': '40px',
        '3xl': '60px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-lg': '0 24px 64px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
        'glass-sm': '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)',
        glow: '0 0 40px rgba(61,107,53,0.3)',
        'glow-str': '0 0 40px rgba(196,123,26,0.3)',
      },
      animation: {
        'mesh-slow': 'meshMove 12s ease-in-out infinite alternate',
        'mesh-slow2': 'meshMove2 15s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        meshMove: {
          '0%':   { transform: 'translate(0%, 0%) scale(1)' },
          '100%': { transform: 'translate(8%, 12%) scale(1.15)' },
        },
        meshMove2: {
          '0%':   { transform: 'translate(0%, 0%) scale(1.1)' },
          '100%': { transform: 'translate(-10%, -8%) scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
