/**
 * La Fattoria Design Tokens
 * See docs/DESIGN_SYSTEM.md for usage guidelines
 */

export const colors = {
  // Primary — forest green
  green: {
    950: '#1a2e14', // logo background
    900: '#2D4A22', // primary actions, headers, nav
    800: '#3a5e2d', // hover states
    100: '#E8F0E4', // light backgrounds, badges
    50: '#F0F5EC', // subtle tints
  },

  // Background — warm cream
  cream: {
    50: '#F5F0E8', // page background
    100: '#EDEBE5', // app shell background
    200: '#E0DBD1', // dividers, borders
  },

  // Gold — brand accent
  gold: {
    500: '#c8b97a', // logo accent, headings on dark
    700: '#7A5C1A', // amber text, secondary actions
    50: '#FFF3CD', // amber badge background
  },

  // Status colors
  status: {
    paid: '#2D9E5F', // green — paid, confirmed, active
    paidBg: '#E6F5ED',
    pending: '#E8B84B', // yellow — in attesa, requested
    pendingBg: '#FFFBF0',
    overdue: '#8B2E2E', // red — overdue, urgent, declined
    overdueBg: '#FCF0F0',
    info: '#1A3A5C', // blue — competition, informational
    infoBg: '#E8EEF5',
  },

  // Neutral
  neutral: {
    900: '#1A1A1A', // primary text
    600: '#75706A', // muted text, labels
    300: '#DDDAD2', // borders
    100: '#F9F7F3', // card backgrounds
    0: '#FFFFFF', // white
  },
} as const;

export const typography = {
  fontDisplay: "Georgia, 'Times New Roman', serif",
  fontBody: "system-ui, -apple-system, sans-serif",
  fontMono: "ui-monospace, 'Courier New', monospace",

  // Scale
  size: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
  },

  // Weight
  weight: {
    normal: 400,
    bold: 700,
  },
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

export const radius = {
  sm: '4px', // buttons, inputs
  md: '8px', // cards, chips
  lg: '12px', // modals, phone cards
  xl: '24px', // phone screen corners
  full: '9999px', // pills, dots
} as const;

export const shadow = {
  sm: '0 1px 3px rgba(0,0,0,0.06)',
  md: '0 4px 16px rgba(0,0,0,0.08)',
  lg: '0 8px 32px rgba(0,0,0,0.12)',
  phone: '0 20px 60px rgba(0,0,0,0.25)',
} as const;

// Status badge mapping
export const STATUS_MAP = {
  pending: {
    label: 'In attesa',
    color: colors.status.pending,
    bg: colors.status.pendingBg,
  },
  paid: {
    label: 'Pagata',
    color: colors.status.paid,
    bg: colors.status.paidBg,
  },
  overdue: {
    label: 'Scaduta',
    color: colors.status.overdue,
    bg: colors.status.overdueBg,
  },
  requested: {
    label: 'Richiesta',
    color: colors.status.pending,
    bg: colors.status.pendingBg,
  },
  confirmed: {
    label: 'Confermata',
    color: colors.status.paid,
    bg: colors.status.paidBg,
  },
  completed: {
    label: 'Completata',
    color: colors.status.info,
    bg: colors.status.infoBg,
  },
  cancelled: {
    label: 'Annullata',
    color: colors.status.overdue,
    bg: colors.status.overdueBg,
  },
} as const;

export type StatusType = keyof typeof STATUS_MAP;
