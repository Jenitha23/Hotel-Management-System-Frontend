/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: '#F5E9DA',
        teal: '#1CA1A6',
        coral: '#FF7F6B',
        deepNavy: '#0B2545'
      }
    },
  },
  plugins: [],
}