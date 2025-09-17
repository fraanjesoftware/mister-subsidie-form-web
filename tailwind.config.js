/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': 'var(--color-accent)',
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'text': 'var(--color-text)',
        'background': 'var(--color-background)',
        'accent-light-1': 'var(--color-accent-light-1)',
        'accent-light-2': 'var(--color-accent-light-2)',
        'accent-light-3': 'var(--color-accent-light-3)',
        'accent-light-4': 'var(--color-accent-light-4)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-medium-1': 'var(--color-primary-medium-1)',
        'primary-medium-2': 'var(--color-primary-medium-2)',
        'primary-light-1': 'var(--color-primary-light-1)',
        'primary-light-2': 'var(--color-primary-light-2)',
        'gray-dark-1': 'var(--color-gray-dark-1)',
        'gray-dark-2': 'var(--color-gray-dark-2)',
        'gray-medium': 'var(--color-gray-medium)',
        'gray-light-1': 'var(--color-gray-light-1)',
        'gray-light-2': 'var(--color-gray-light-2)',
        'gray-light-3': 'var(--color-gray-light-3)',
        'gray-light-4': 'var(--color-gray-light-4)',
        'gray-light-5': 'var(--color-gray-light-5)',
        'gray-light-6': 'var(--color-gray-light-6)',
        'accent-transparent': 'var(--color-accent-transparent)',
        'primary-transparent': 'var(--color-primary-transparent)',
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-heading)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
