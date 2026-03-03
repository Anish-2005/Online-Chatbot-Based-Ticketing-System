/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter', 'system-ui', 'sans-serif'],
      'heading': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      'mono': ['Fira Code', 'monospace'],
    },
    extend: {
      colors: {
        // Primary colors
        'primary-dark': '#6C5CE7',
        'primary-light': '#A29BFE',
        'primary-accent': '#00B894',
        
        // Secondary colors
        'secondary-dark': '#2D3436',
        'secondary-light': '#DFE6E9',
        'secondary-gray': '#636E72',
        
        // Accent colors
        'accent-warm': '#FF7675',
        'accent-cool': '#74B9FF',
        'accent-yellow': '#FFE66D',
        
        // Gray scale
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px 0 rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px 0 rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 20s infinite ease-in-out',
        'pulse-custom': 'pulse 2s infinite',
        'fadeIn': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(30px) translateX(20px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

