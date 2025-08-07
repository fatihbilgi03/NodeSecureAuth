// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#e30613',  // <-- burayı düzelttik
        secondary:  '#161616',
        background: '#0f1b28',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function({ addBase, theme }) {
      addBase({
        'input, textarea, select': {
          color: theme('colors.secondary'),
          backgroundColor: '#ffffff',
          borderColor: theme('colors.gray.300'),
          borderWidth: '1px',
          borderRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
        },
        'input:focus, textarea:focus, select:focus': {
          outline:   'none',
          boxShadow: 'none',
          backgroundColor: '#ffffff',
          borderColor: theme('colors.primary'),  // primary’yi kullanıyoruz
        },
        'input::placeholder, textarea::placeholder': {
          color: theme('colors.gray.400'),
        },
      });
    }),
  ],
};
