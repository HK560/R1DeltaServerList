/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'titanfall': {
          'primary': '#1a1a1a',
          'secondary': '#2d2d2d',
          'accent': '#ff4655'
        }
      }
    },
  },
  plugins: [],
} 