/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Real Velvet Rose Petals
        rosePetal: {
          50: '#fff5f7',
          100: '#ffe4ea',
          200: '#ffccd8',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f6e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        // Real Rich Velvet Red & Rose Accent
        velvetRose: {
          400: '#f72585',
          500: '#e63968',
          600: '#d9255a',
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        },
        // Deep High-Contrast Text (100% sharp and readable on white/pink cards)
        roseDark: {
          950: '#12030d',
          900: '#1a0512',
          850: '#220819',
          800: '#2e0c22',
          700: '#471436',
          600: '#661f4e',
          500: '#8c2d6c',
        },
        // Fresh Natural Rose Leaf Greens
        roseLeaf: {
          100: '#d8f3dc',
          200: '#b7e4c7',
          300: '#95d5b2',
          500: '#40916c',
          600: '#2d6a4f',
          700: '#1b4332',
        },
        // Warm Gold / Honey dew
        honeyGold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        handwritten: ['"Dancing Script"', '"Caveat"', '"Great Vibes"', 'cursive'],
        script: ['"Great Vibes"', 'cursive'],
        letter: ['"Caveat"', '"Dancing Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'rose-soft': '0 10px 30px -5px rgba(217, 37, 90, 0.15), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'rose-glow': '0 12px 35px rgba(217, 37, 90, 0.35)',
        'card-clean': '0 8px 24px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
