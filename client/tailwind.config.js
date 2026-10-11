/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F8F5EF',  // Warm ivory (replaces dark blue background)
          100: '#FFFDF8', // Creamy white (replaces card backgrounds)
          200: '#EAE0D2', // Soft beige (replaces lighter sections/hover)
          300: '#D8CBB9', // Soft taupe (borders)
          400: '#B98265', // Muted terracotta (accent)
          500: '#9c785cff', // Elegant brown (primary buttons/active state)
          600: '#54463C', // Dark brown (headings)
          700: '#54463C', // Dark brown (main text)
          800: '#54463C', // Darker secondary text
          900: '#0f0f0fff',
          950: '#F8F5EF',
        },
        theme: {
          main: '#F8F5EF',
          section: '#EAE0D2',
          card: '#FFFDF8',
          btn: '#8f715aff',
          'btn-hover': '#8f6c52ff',
          heading: '#54463C', // Dark brown
          accent: '#B98265',
          border: '#D8CBB9',
          text: '#54463C', // Dark brown
          muted: '#54463C', // Darker muted
          success: '#72836A',
          error: '#B65F52',
        },
        slate: {
          950: '#F8F5EF', // Warm ivory (Main bg)
          900: '#FFFDF8', // Creamy white (Cards)
          800: '#EAE0D2', // Soft beige (Sections)
          700: '#D8CBB9', // Borders
          400: '#54463C', // Darker secondary text
          300: '#54463C', // Darker secondary text
          200: '#54463C', // Headings
          100: '#54463C', // Main text
        },
        emerald: {
          400: '#72836A', // Success indicators
          500: '#72836A',
          600: '#72836A',
        },
        rose: {
          400: '#B65F52', // Error indicators
          500: '#B65F52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
