/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'selector',
  content: [, './index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fonts: ['Open Sans', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        base: {
          light: '#262119',
          DEFAULT: '#2d3232',
          dark: '#1f1b13',
        },
        t: {
          sec: '#aca6ac',
          DEFAULT: '#ccc8cc',
          dark: '#9b949',
        },
        hl: {
          light: '#6599ff',
          DEFAULT: '#0055ff',
          dark: '#003fbd',
        },
        shl: {
          light: '#4ce6ff',
          DEFAULT: '#00ceef',
          dark: '#00acc8',
        },
        error: {
          DEFAULT: '#d73241',
        },
        success: {
          DEFAULT: '#00f000',
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}

export default config
