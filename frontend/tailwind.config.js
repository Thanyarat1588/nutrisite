/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2d7d46', light: '#48bb78', xlight: '#d4edda', dark: '#1a5c33' },
        amber:   '#f6ad55',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
