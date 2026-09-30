/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary — dark blue for navigation
        'sti-navy': {
          50: '#EEF3FA',
          100: '#D5E0EF',
          200: '#AABFDF',
          300: '#7E9ECF',
          400: '#537EBF',
          500: '#3B639E',
          600: '#2C4D7E',
          700: '#1E3761',
          800: '#0F2A4A',
          900: '#0A1F38',
        },
        // Accent — turquoise from logo
        'sti-teal': {
          50: '#E8FBF7',
          100: '#C7F5EC',
          200: '#94EBD9',
          300: '#56DDC1',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0B7B72',
          800: '#0A6360',
          900: '#085250',
        },
      },
      boxShadow: {
        'sti': '0 1px 3px rgba(15, 42, 74, 0.06), 0 1px 2px rgba(15, 42, 74, 0.04)',
        'sti-md': '0 4px 12px rgba(15, 42, 74, 0.08)',
        'sti-lg': '0 12px 32px rgba(15, 42, 74, 0.12)',
      },
    },
  },
  plugins: [],
};
