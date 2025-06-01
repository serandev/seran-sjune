/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        himelody: ['"Hi Melody"', 'cursive'],
        gowunbatang: ['"Gowoun Batang"', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      },
    },
  },
  plugins: [],
};