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
        bg: {
          DEFAULT: '#e6e6e6',
        },
        base: {
          light: '#262119',
          DEFAULT: '#28282e',
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
        secondary: {
          DEFAULT: '#FFAA00',
          dark: '#E29700',
        },
        error: {
          DEFAULT: '#d73241',
          dark: '#bc2532',
        },
        success: {
          DEFAULT: '#00f000',
        },
        gray: {
          light: '#d6d3d1',
          DEFAULT: '#a8a29e',
          dark: '#78716c',
        },
      },
      opacity: {
        disabled: '0.6',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}

export default config
