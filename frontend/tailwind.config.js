/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: { DEFAULT: '#1565C0', light: '#1976D2', dark: '#0D47A1' },
        ink: { DEFAULT: '#0A1628', 100: '#EFF6FF', 200: '#DBEAFE', 300: '#BFDBFE' }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [],
}
