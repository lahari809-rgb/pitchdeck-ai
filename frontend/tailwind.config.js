/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0B14',
        panel: '#13131F',
        card: '#181826',
        accent: {
          DEFAULT: '#7C5CFF',
          light: '#A78BFA',
          dark: '#5B3FE0'
        },
        success: '#22C55E'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 60px rgba(124,92,255,0.35)'
      }
    }
  },
  plugins: []
};
