/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:             '#f7f6f2',
          surface:        '#ffffff',
          border:         '#e8e4dc',
          sage:           '#7fb069',
          'sage-light':   '#e8f5e2',
          'sage-dim':     '#a8c899',
          purple:         '#9b8ec4',
          'purple-light': '#ede9f8',
          'purple-dim':   '#b8aed4',
          text:           '#374151',
          muted:          '#6b7280',
          danger:         '#e07070',
          warn:           '#e8a44a',
          dim:            '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'card-press': '0 1px 4px rgba(0,0,0,0.08)',
        'nav':        '0 -4px 24px rgba(0,0,0,0.06)',
        'modal':      '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        'button':     '0 2px 8px rgba(127,176,105,0.30)',
        'button-purple': '0 2px 8px rgba(155,142,196,0.35)',
        'inner-sm':   'inset 0 1px 3px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}