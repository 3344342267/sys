/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4af37',
          dark: '#c49f32',
        },
        background: {
          DEFAULT: '#1a1b2e',
          secondary: '#2d2a4a',
          tertiary: '#3d3a5a',
        },
        text: {
          DEFAULT: '#e8e6e3',
          secondary: '#8b8997',
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'serif'],
      },
    },
  },
  plugins: [],
}
