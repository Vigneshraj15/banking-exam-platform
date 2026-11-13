/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      },
      colors: {
        exam: {
          header: '#32588e',
          accent: '#264a7c',
          green: '#2e7d32',
          red: '#d32f2f',
          silver: '#e0e0e0',
          purple: '#673ab7',
          answeredMarked: '#673ab7'
        }
      }
    },
  },
  plugins: [],
}
