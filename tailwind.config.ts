import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          green:  '#1a9e58',
          'green-dark': '#147a44',
          'green-light': '#e6f7ef',
          'green-mid': '#c2ecd7',
          red:    '#d42b25',
          'red-light': '#fde8e8',
        },
      },
    },
  },
  plugins: [],
}

export default config
