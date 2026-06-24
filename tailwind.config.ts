import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        bg:       '#0A0A0F',
        'bg-subtle': '#0F0F16',
        surface:  '#111118',
        'surface-2': '#16161F',
        'surface-3': '#1C1C28',
        border:   'rgba(255,255,255,0.07)',
        'border-strong': 'rgba(255,255,255,0.12)',
        text1:    '#F2F2F7',
        text2:    '#8E8EA0',
        text3:    '#55556A',
        emerald:  '#00C896',
        violet:   '#8B5CF6',
        danger:   '#FF4D6D',
        warning:  '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        xs:   ['11px', '16px'],
        sm:   ['13px', '20px'],
        base: ['14px', '22px'],
        md:   ['15px', '24px'],
        lg:   ['17px', '26px'],
        xl:   ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '38px'],
        '4xl': ['36px', '44px'],
        '5xl': ['48px', '56px'],
        '6xl': ['60px', '68px'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        sm:      '0 1px 3px rgba(0,0,0,0.4)',
        md:      '0 4px 16px rgba(0,0,0,0.5)',
        lg:      '0 8px 32px rgba(0,0,0,0.6)',
        emerald: '0 0 24px rgba(0,200,150,0.15)',
        violet:  '0 0 24px rgba(139,92,246,0.15)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in':   'slideIn 0.35s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
