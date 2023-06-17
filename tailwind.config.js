/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jetBlack: {
          400: '#080808', // Darker shade (10% darker)
          500: '#0A0A0A', // Original color
          600: '#0C0C0C', // Lighter shade (10% lighter)
        },
        platinum: {
          400: '#D8D7D4', // Darker shade (10% darker)
          500: '#E5E4E2', // Original color
          600: '#F2F1EF', // Lighter shade (10% lighter)
        },
        vermillion: {
          400: '#CB291F', // Darker shade (10% darker)
          500: '#E34234', // Original color
          600: '#F35F4A', // Lighter shade (10% lighter)
        },
      },
    },
  },
  plugins: [],
}

