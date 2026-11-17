/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1F2F3',
        paperDark: '#E8E9EB',
        ink: '#111111',
        inkLight: '#1A1A1A',
        accent: '#E7472E',
        accentDark: '#C93A23',
        body: '#333333',
        muted: '#666666',
        line: '#DCDDDF',
        lineDark: '#262626',
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', 'Space Grotesk', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.055em',
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.12em',
        wider: '0.18em',
        widest: '0.24em',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
