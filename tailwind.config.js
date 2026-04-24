/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F2747',
          ink: '#111111',
          paper: '#FFFFFF',
          mist: '#E9EEF6'
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15,39,71,0.08)'
      }
    }
  },
  plugins: []
};
