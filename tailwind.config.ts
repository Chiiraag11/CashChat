import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

/**
 * Every color below resolves to a CSS variable defined in src/app/globals.css,
 * so one class (e.g. `bg-card`, `text-emerald-400`) renders correctly in both
 * the light and the dark theme. Channel variables ("r g b") are used so that
 * Tailwind opacity modifiers like `bg-card/60` keep working.
 */
const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        /* Legacy aliases kept so existing class names keep working */
        bg: rgb('--bg-rgb'),
        'bg-subtle': rgb('--bg-subtle-rgb'),
        surface: rgb('--surface-rgb'),
        'surface-2': rgb('--surface-2-rgb'),
        'surface-3': rgb('--surface-3-rgb'),
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text1: rgb('--text-1-rgb'),
        text2: rgb('--text-2-rgb'),
        text3: rgb('--text-3-rgb'),
        danger: rgb('--red-rgb'),
        warning: rgb('--amber-rgb'),

        /* Semantic tokens (shadcn-style) */
        background: rgb('--bg-rgb'),
        foreground: rgb('--text-1-rgb'),
        card: { DEFAULT: rgb('--surface-rgb'), foreground: rgb('--text-1-rgb') },
        muted: { DEFAULT: rgb('--surface-2-rgb'), foreground: rgb('--text-2-rgb') },
        primary: { DEFAULT: rgb('--emerald-rgb'), foreground: '#ffffff' },
        destructive: { DEFAULT: rgb('--red-rgb'), foreground: '#ffffff' },
        input: 'var(--border-strong)',
        ring: rgb('--emerald-rgb'),

        /* Brand accents. 300/400 are the "readable text" shades and flip per theme;
           500/600 are fixed fills that work on both backgrounds. */
        emerald: {
          ...colors.emerald,
          DEFAULT: rgb('--emerald-rgb'),
          300: rgb('--emerald-text-rgb'),
          400: rgb('--emerald-text-rgb'),
          500: '#00C896',
          600: '#00A87A',
        },
        violet: {
          ...colors.violet,
          DEFAULT: rgb('--violet-rgb'),
          300: rgb('--violet-text-rgb'),
          400: rgb('--violet-text-rgb'),
          500: '#8B5CF6',
        },
        cyan: { ...colors.cyan, 300: rgb('--cyan-text-rgb'), 400: rgb('--cyan-text-rgb') },
        sky: { ...colors.sky, 300: rgb('--sky-text-rgb'), 400: rgb('--sky-text-rgb') },
        amber: { ...colors.amber, 300: rgb('--amber-text-rgb'), 400: rgb('--amber-text-rgb') },
      },
      borderColor: { DEFAULT: 'var(--border)' },
      divideColor: { DEFAULT: 'var(--border)' },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
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
        '7xl': ['72px', '76px'],
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
        sm:      'var(--shadow-sm)',
        md:      'var(--shadow-md)',
        lg:      'var(--shadow-lg)',
        emerald: '0 0 24px rgba(0,200,150,0.15)',
        violet:  '0 0 24px rgba(139,92,246,0.15)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        'float':    'float 7s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};

export default config;
