/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0C8FE9",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 