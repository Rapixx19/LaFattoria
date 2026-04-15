import type { Config } from 'tailwindcss';
import { colors, typography, shadow, radius } from './src/tokens';

/**
 * Shared Tailwind preset for La Fattoria apps
 * Import this in each app's tailwind.config.ts
 */
export const lafattoriaPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: colors.green[900],
          dark: colors.green[950],
          hover: colors.green[800],
          light: colors.green[100],
          subtle: colors.green[50],
        },
        // Background
        cream: {
          DEFAULT: colors.cream[50],
          100: colors.cream[100],
          200: colors.cream[200],
        },
        // Accent
        gold: {
          DEFAULT: colors.gold[500],
          dark: colors.gold[700],
          light: colors.gold[50],
        },
        // Status
        paid: colors.status.paid,
        'paid-bg': colors.status.paidBg,
        pending: colors.status.pending,
        'pending-bg': colors.status.pendingBg,
        overdue: colors.status.overdue,
        'overdue-bg': colors.status.overdueBg,
        info: colors.status.info,
        'info-bg': colors.status.infoBg,
        // Neutral
        muted: colors.neutral[600],
        border: colors.neutral[300],
        card: colors.neutral[100],
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['10px', { lineHeight: '1.4' }],
        sm: ['12px', { lineHeight: '1.4' }],
        base: ['14px', { lineHeight: '1.5' }],
        md: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.4' }],
        xl: ['22px', { lineHeight: '1.3' }],
        '2xl': ['28px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
      },
      boxShadow: {
        sm: shadow.sm,
        md: shadow.md,
        lg: shadow.lg,
        phone: shadow.phone,
      },
      spacing: {
        18: '72px',
        22: '88px',
      },
    },
  },
};

export default lafattoriaPreset;
