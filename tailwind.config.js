/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#C8DA47',
        'primary': '#03291F',
        'secondary': '#C7DA46',
        'text': '#1D1E1D',
        'accent-light-1': '#D2E06C',
        'accent-light-2': '#DEE790',
        'accent-light-3': '#E8EFB5',
        'accent-light-4': '#F3F7DA',
        'primary-dark': '#03291F',
        'primary-medium-1': '#1E3E35',
        'primary-medium-2': '#455E57',
        'primary-light-1': '#829490',
        'primary-light-2': '#CED5D2',
        'gray-dark-1': '#393E3A',
        'gray-dark-2': '#5B5E5B',
        'gray-medium': '#919392',
        'gray-light-1': '#D3D4D3',
        'gray-light-2': '#FAF8F6',
        'gray-light-3': '#E9E6E4',
        'gray-light-4': '#CFCBCA',
        'gray-light-5': '#C2BFBD',
        'gray-light-6': '#ACA9A7',
        'accent-transparent': '#F3F7DA38',
        'primary-transparent': '#455E570A',
      },
      fontFamily: {
        'sans': ['Raleway', 'sans-serif'],
      }
    },
  },
  plugins: [],
}