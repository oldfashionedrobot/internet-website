import type { Config } from 'tailwindcss'

export const COLORS = {
  red: { DEFAULT: 'red' },
  orange: { DEFAULT: 'orange' },
  yellow: { DEFAULT: 'yellow' },
  green: { DEFAULT: 'lime' },
  blue: { DEFAULT: 'blue' },
  purple: { DEFAULT: 'blueviolet' },
  cyan: { DEFAULT: 'cyan' },
  magenta: { DEFAULT: 'magenta' },
  black: { DEFAULT: 'black' },
  white: { DEFAULT: 'white' }
} as const

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: COLORS.black.DEFAULT,
        foreground: COLORS.white.DEFAULT,
        ...COLORS
      }
    }
  },
  plugins: []
} satisfies Config
