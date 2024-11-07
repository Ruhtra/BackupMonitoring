import type { Config } from 'tailwindcss'

export default {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config
