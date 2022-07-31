module.exports = {
  purge: ['./src/**/*.tsx', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#18181B',
          850: '#202023',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8',
          200: '#E4E4E7',
          100: '#F4F4F5',
          50: '#FAFAFA',
        },
        upvote: '#ff4500',
        downvote: '#7193ff',
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      maxWidth: {
        '3xl': '740px',
        '2xl': '640px',
      },
      screens: {
        lg: '960px',
      },
    },
    fontFamily: {
      sans: ['IBM Plex Sans', 'Arial', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundOpacity: ['active'],
      display: ['group-hover'],
      visibility: ['group-hover'],
    },
  },
  plugins: [],
};
