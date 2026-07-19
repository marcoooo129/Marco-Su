/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f5f0',
        ink: '#141412',
        quiet: '#6f706b',
        line: '#d8d7d0',
        signal: '#ff5a36',
        cobalt: '#315cff',
        mint: '#b9f3d0',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        display: ['Instrument Sans', 'Inter', 'Arial', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
