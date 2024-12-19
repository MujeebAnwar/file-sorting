import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** @type {import('tailwindcss').Config} */
export default defineConfig({
  plugins: [vue()],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  }
})