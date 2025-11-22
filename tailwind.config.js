/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          50: '#F8F4E8',
          100: '#F1E9D1',
          200: '#E8DDB3',
          300: '#DFD195',
          400: '#D7C577',
          500: '#D4AF37',
          600: '#B8982D',
          700: '#9C8024',
          800: '#80681B',
          900: '#645012',
        },
      },
    },
  },
  plugins: [],
}
