/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EFE7D8',
          300: '#E2D3B8',
          400: '#D4BC93',
          500: '#C29F68',
          600: '#A98047',
          700: '#866133',
          800: '#5F4323',
          900: '#3D2A16',
          950: '#1A120B',
          accent: '#F59E0B',
          glow: '#FBBF24',
          honey: '#FDE68A',
          terracotta: '#EA580C',
        },
        surface: {
          darkest: '#0A0807',
          dark: '#14100E',
          card: 'rgba(26, 20, 16, 0.55)',
          cardHover: 'rgba(38, 28, 22, 0.7)',
          border: 'rgba(255, 235, 210, 0.12)',
          borderActive: 'rgba(245, 158, 11, 0.45)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['"Outfit"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Playfair Display"', '"Cinzel"', '"Noto Serif SC"', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
