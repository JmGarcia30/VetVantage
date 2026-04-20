/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to scan all your components
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',   // Nice Blue
        secondary: '#10b981', // Nice Green
      }
    },
  },
  plugins: [],
}