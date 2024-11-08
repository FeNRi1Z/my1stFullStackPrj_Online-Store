/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#A4651D',
          100: '#EA9029'
        },
        secondary: {
          50: '#656565',
          100: '#989898'
        },
      }
    },
  },
  plugins: [],
}

