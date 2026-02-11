/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tennis-green': '#adff2f',
        'gold': '#ffd700',
      }
    },
  },
  plugins: [],
}