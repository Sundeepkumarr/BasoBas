/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f9f1',
          100: '#e5f2de',
          200: '#cbe3be',
          300: '#a6ce91',
          400: '#84b56b',
          500: '#7cb342',
          600: '#649935',
          700: '#4e7b29',
          800: '#3e6224',
          900: '#2b411a',
          950: '#14230c',
          DEFAULT: '#7cb342',
        },
        accent: {
          50: '#f2f6fa',
          100: '#e1ecf4',
          200: '#bed5e6',
          300: '#8cb3d2',
          400: '#558eb9',
          500: '#3271a3',
          600: '#235a87',
          700: '#1d486d',
          800: '#193e5b',
          900: '#0a2e5c',
          950: '#061d3b',
          DEFAULT: '#0a2e5c',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#dcfce7',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#fee2e2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 20px 60px -15px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 16px 32px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f4f9f1 0%, #e5f2de 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a2e5c 0%, #1d486d 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0a2e5c 0%, #193e5b 45%, #7cb342 100%)',
        'gradient-accent': 'linear-gradient(135deg, #1d486d 0%, #3271a3 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
