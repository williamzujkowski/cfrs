/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/web/index.html',
    './apps/web/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media', // Use system preference
  theme: {
    extend: {
      // Mobile-first breakpoints (375px–2560px)
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '2560px',
      },

      // Print-optimized spacing
      spacing: {
        'print': '0.5in',
      },

      // ATS-safe fonts
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },

      // Accessible color palette
      colors: {
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],

  // Print optimization
  safelist: [
    'print:hidden',
    'print:block',
    'print:break-inside-avoid',
    'print:break-after-page',
  ],
};
