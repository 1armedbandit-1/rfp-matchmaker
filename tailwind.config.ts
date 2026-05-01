import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fight: {
          red: '#E63946',
        },
        background: {
          app: '#FAFAF7',
        },
        text: {
          primary: '#1A1A1A',
          muted: '#6B6B6B',
        },
        border: {
          DEFAULT: '#EAEAEA',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [animate],
} satisfies Config

export default config
