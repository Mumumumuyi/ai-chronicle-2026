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
        // Museum prototype tokens (design/prototype-v2.html :root)
        ob: '#0C0A09',
        ob2: '#14110F',
        pearl: '#F4F1EA',
        mist: '#FBFAF6',
        ink: '#13161C',
        gold: '#C9A86A',
        gold2: '#E3C892',
        goldd: '#9A7B43',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', 'serif'],
        serif: ['"Noto Serif SC"', '"Songti SC"', 'serif'],
        sans: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
