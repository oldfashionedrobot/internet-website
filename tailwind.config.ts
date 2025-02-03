import type { Config } from 'tailwindcss'

export const COLORS = {
  red: { DEFAULT: '#ea4335' },
  orange: { DEFAULT: '#ff6d01' },
  yellow: { DEFAULT: '#fbbc04' },
  green: { DEFAULT: '#34a853' },
  blue: { DEFAULT: '#4285f4' },
  purple: { DEFAULT: '#9900ff' },
  teal: { DEFAULT: '#46bdc6' },
  pink: { DEFAULT: '#DC21FD' },
  black: { DEFAULT: '#000000' },
  white: { DEFAULT: '#ffffff' },
  gray: { dark: '#434343', DEFAULT: '#cccccc', light: '#f3f3f3' },
  transparent: 'transparent',
  current: 'currentColor'
} as const

export default {
  content: [
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    colors: {
      ...COLORS,
      background: COLORS.white.DEFAULT,
      foreground: COLORS.black.DEFAULT,
      highlight: COLORS.green.DEFAULT,
      info: COLORS.blue.DEFAULT,
      success: COLORS.green.DEFAULT,
      error: COLORS.red.DEFAULT,
      warning: COLORS.yellow.DEFAULT
    }
  },
  plugins: []
} satisfies Config
