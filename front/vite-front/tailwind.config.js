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
          50: '#f0f9f0',
          100: '#e0f2e0',
          200: '#c3e6c3',
          300: '#97d497',
          400: '#6bbf6b',
          500: '#238744', // Verde principal (header)
          600: '#1d6b36',
          700: '#174f29',
          800: '#0f3319',
          900: '#051406',
        },
        secondary: {
          50: '#f0f4f8',
          100: '#e1eaf2',
          200: '#c3d5e5',
          300: '#97b8d3',
          400: '#6b95bd',
          500: '#092747', // Azul principal
          600: '#071d37',
          700: '#05152a',
          800: '#030c1a',
          900: '#01050d',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      }
    },
  },
  plugins: [],
}
