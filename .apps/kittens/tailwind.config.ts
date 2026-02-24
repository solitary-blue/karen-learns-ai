import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './callouts-config.yml',
  ],
  theme: {
    extend: {
      /* Direct Montessori tokens — keep for backward compat */
      colors: {
        'montessori-cream': '#F5F1E8',
        'montessori-gold': '#D4A574',
        'montessori-charcoal': '#2C2C2C',

        /* shadcn semantic colors via CSS variables */
        border: 'hsl(var(--border, var(--border-color, 0 0% 90%)))',
        input: 'hsl(var(--input, var(--border-color, 0 0% 90%)))',
        ring: 'hsl(var(--ring, var(--primary, 0 0% 10%)))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 0 0% 10%))',
        primary: {
          DEFAULT: 'hsl(var(--primary, 0 0% 10%))',
          foreground: 'hsl(var(--primary-foreground, var(--foreground, 0 0% 100%)))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary, 0 0% 96%))',
          foreground: 'hsl(var(--secondary-foreground, var(--foreground, 0 0% 10%)))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive, 0 84% 60%))',
          foreground: 'hsl(var(--destructive-foreground, var(--foreground, 0 0% 100%)))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 0 0% 96%))',
          foreground: 'hsl(var(--muted-foreground, var(--foreground, 0 0% 45%)))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent, 0 0% 96%))',
          foreground: 'hsl(var(--accent-foreground, var(--foreground, 0 0% 10%)))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover, var(--background, 0 0% 100%)))',
          foreground: 'hsl(var(--popover-foreground, var(--foreground, 0 0% 10%)))',
        },
        card: {
          DEFAULT: 'hsl(var(--card, var(--background, 0 0% 100%)))',
          foreground: 'hsl(var(--card-foreground, var(--foreground, 0 0% 10%)))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        serif: ['var(--font-title)', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['var(--font-main)', '"Avenir Next"', 'Avenir', '"Seravek"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground, 0 0% 10%))',
            h1: {
              color: 'hsl(var(--headers-h1-color, var(--headers-color, var(--foreground, 0 0% 10%))))',
              fontWeight: '700',
            },
            h2: {
              color: 'hsl(var(--headers-h2-color, var(--headers-color, var(--foreground, 0 0% 10%))))',
            },
            h3: {
              color: 'hsl(var(--headers-h3-color, var(--headers-color, var(--foreground, 0 0% 10%))))',
            },
            h4: {
              color: 'hsl(var(--headers-h4-color, var(--headers-color, var(--foreground, 0 0% 10%))))',
            },
            'ul > li::marker': {
              color: theme('colors.muted.foreground'),
            },
            'ol > li::marker': {
              color: theme('colors.muted.foreground'),
            },
          },
        },
      }),
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
