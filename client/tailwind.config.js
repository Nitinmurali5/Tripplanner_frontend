/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"League Spartan"', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#fdf8f3',
          DEFAULT: '#fdf8f3',
          secondary: '#f5f0eb',
          accent: '#2563EB',
          dark: '#262626',
          orange: '#2563EB',
          blue: '#262626',
        },
        st: {
          primary: '#fdf8f3',
          secondary: '#f5f0eb',
          accent: '#2563EB',
          charcoal: '#262626',
        },
        blue: {
          50: '#f5f0eb',
          100: '#e5e5e5',
          500: '#262626',
          600: '#1f1f1f',
          700: '#141414',
          800: '#0a0a0a',
        },
        orange: {
          50: '#fdf8f3',
          100: '#eef2ff',
          500: '#2563EB',
          600: '#1d4ed8',
          700: '#1e40af',
        }
      },
      transitionTimingFunction: {
        'super': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'bounce-slow': 'bounce-slow 4s ease-in-out infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        }
      }
    },
  },
  plugins: [],
}