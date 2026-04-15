# La Fattoria — Design System

Implement this exactly. These tokens are used across both PWA apps.
Reference: `packages/ui/tokens.ts`

---

## Brand Identity

Equestrian luxury. Warm, professional, trustworthy.
Typography leans serif for display. Interfaces are clean and uncluttered.
Mobile-first — designed for 375px, scaled to desktop.

---

## Color Tokens

```ts
// packages/ui/tokens.ts
export const colors = {
  // Primary — forest green
  green: {
    950: '#1a2e14',  // logo background
    900: '#2D4A22',  // primary actions, headers, nav
    800: '#3a5e2d',  // hover states
    100: '#E8F0E4',  // light backgrounds, badges
    50:  '#F0F5EC',  // subtle tints
  },

  // Background — warm cream
  cream: {
    50:  '#F5F0E8',  // page background
    100: '#EDEBE5',  // app shell background
    200: '#E0DBD1',  // dividers, borders
  },

  // Gold — brand accent
  gold: {
    500: '#c8b97a',  // logo accent, headings on dark
    700: '#7A5C1A',  // amber text, secondary actions
    50:  '#FFF3CD',  // amber badge background
  },

  // Status colors
  status: {
    paid:    '#2D9E5F',  // green — paid, confirmed, active
    paidBg:  '#E6F5ED',
    pending: '#E8B84B',  // yellow — in attesa, requested
    pendingBg: '#FFFBF0',
    overdue: '#8B2E2E',  // red — overdue, urgent, declined
    overdueBg: '#FCF0F0',
    info:    '#1A3A5C',  // blue — competition, informational
    infoBg:  '#E8EEF5',
  },

  // Neutral
  neutral: {
    900: '#1A1A1A',  // primary text
    600: '#75706A',  // muted text, labels
    300: '#DDDAD2',  // borders
    100: '#F9F7F3',  // card backgrounds
    0:   '#FFFFFF',  // white
  },
}
```

---

## Typography

```ts
export const typography = {
  fontDisplay: "Georgia, 'Times New Roman', serif",
  fontBody:    "system-ui, -apple-system, sans-serif",
  fontMono:    "ui-monospace, 'Courier New', monospace",

  // Scale
  size: {
    xs:   '10px',
    sm:   '12px',
    base: '14px',
    md:   '16px',
    lg:   '18px',
    xl:   '22px',
    '2xl':'28px',
  },

  // Weight
  weight: {
    normal: 400,
    bold:   700,
  },

  // Usage rules:
  // - Page titles, card headers, invoice text → Georgia (fontDisplay)
  // - Body text, labels, inputs, tables → system-ui (fontBody)
  // - Article codes, amounts → fontMono
}
```

---

## Spacing

```ts
export const spacing = {
  // Use multiples of 4px
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
}
```

---

## Border Radius

```ts
export const radius = {
  sm:   '4px',   // buttons, inputs
  md:   '8px',   // cards, chips
  lg:   '12px',  // modals, phone cards
  xl:   '24px',  // phone screen corners
  full: '9999px', // pills, dots
}
```

---

## Shadow

```ts
export const shadow = {
  sm:   '0 1px 3px rgba(0,0,0,0.06)',
  md:   '0 4px 16px rgba(0,0,0,0.08)',
  lg:   '0 8px 32px rgba(0,0,0,0.12)',
  phone:'0 20px 60px rgba(0,0,0,0.25)',
}
```

---

## Status Badge Component

```tsx
// packages/ui/components/status-badge.tsx
type Status = 'pending' | 'paid' | 'overdue' | 'requested' | 'confirmed' | 'completed' | 'cancelled'

const STATUS_MAP = {
  pending:   { label: 'In attesa',  color: colors.status.pending,  bg: colors.status.pendingBg },
  paid:      { label: 'Pagata',     color: colors.status.paid,     bg: colors.status.paidBg },
  overdue:   { label: 'Scaduta',    color: colors.status.overdue,  bg: colors.status.overdueBg },
  requested: { label: 'Richiesta',  color: colors.status.pending,  bg: colors.status.pendingBg },
  confirmed: { label: 'Confermata', color: colors.status.paid,     bg: colors.status.paidBg },
  completed: { label: 'Completata', color: colors.status.info,     bg: colors.status.infoBg },
  cancelled: { label: 'Annullata',  color: colors.status.overdue,  bg: colors.status.overdueBg },
}
```

---

## Navigation

### Owner App — Bottom Nav (mobile) / Side Nav (desktop)
```
📅 Agenda   |   🔔 Richieste   |   🐴 Cavalli   |   ◉ Clienti   |   🧾 Fatture
```

### Client App — Bottom Nav
```
⌂ Home   |   ＋ Prenota   |   🐴 Cavallo   |   🧾 Fatture   |   ◉ Profilo
```

Bottom nav specs:
- Height: 56px + safe area inset
- Active item: green dot + bold label
- Icon size: 20px
- Label size: 10px

---

## Phone Frame (mockup reference)

```
Frame:      #111111, border-radius 36px
Notch:      60px × 10px, centered
Screen:     border-radius 24px inside frame
Home bar:   60px × 4px, #444444, centered below screen
```

---

## Tailwind Config Extension

```ts
// tailwind.config.ts (both apps extend this)
theme: {
  extend: {
    colors: {
      primary:  '#2D4A22',
      'primary-light': '#E8F0E4',
      cream:    '#F5F0E8',
      gold:     '#c8b97a',
      amber:    '#7A5C1A',
      muted:    '#75706A',
      border:   '#DDDAD2',
      paid:     '#2D9E5F',
      pending:  '#E8B84B',
      overdue:  '#8B2E2E',
    },
    fontFamily: {
      display: ['Georgia', 'Times New Roman', 'serif'],
      body:    ['system-ui', '-apple-system', 'sans-serif'],
    },
  },
}
```

---

## Component Patterns

### Page Header (Owner App)
```
Background: green.900
Top: status bar
Left: section title (white, Georgia, 16px bold)
Right: optional action button (gold pill)
Below header: week strip or breadcrumb
```

### Page Header (Client App)
```
Background: green.900
Left: greeting + subtitle (white)
Right: avatar circle (gold, initials)
Overlapping card below: horse card with shadow
```

### Card
```
Background: white
Border: 1px solid neutral.300
Border-radius: 12px
Padding: 12-16px
Shadow: shadow.md on elevated cards
```

### List Row
```
Background: neutral.100 or white
Border-radius: 8px
Padding: 10px 12px
Left: status dot (8px circle)
Right: amount or action button
Tap target: min 44px height
```

### Primary Button
```
Background: green.900
Color: white
Border-radius: 12px (mobile), 4px (desktop forms)
Padding: 12px (mobile), 10px 20px (desktop)
Font: system-ui, 14px bold
```

### Invoice Document
```
Font: Georgia throughout
Background: white
Logo: SVG (dark green box, gold C.H.C. HORSES text, white LA FATTORIA)
Table border: 1px solid #ccc8c0
Header row: background #e8e4dc
Totale row: background #e8e4dc, bold
Footer: two-column, 11px, company details left / IBAN right
```

---

## Invoice Colour Map (table rows)

```
Art. 3210 Pensione       → no colour accent
Art. 3211 Monta          → no colour accent
Art. 3212 Lezione        → no colour accent
Art. 3214 Trasporti      → no colour accent
Art. 3218 Giostra        → no colour accent
TOTALE row               → background #e8e4dc
Vs.Versamento row        → color: muted
A SALDO row (= 0)        → color: paid green, bold
A SALDO row (> 0)        → color: overdue red, bold
```

---

## Animation

Keep animations minimal:
- Page transitions: none (PWA feels native)
- Loading skeleton: pulse opacity 0.6 → 1
- Toast/notification slide: from top, 300ms ease-out
- Status badge: no animation
- Button press: scale(0.97), 100ms

---

## Accessibility

- All interactive elements: min 44×44px
- Color is never the sole indicator of status (always pair with text label)
- Form inputs always have visible labels (not just placeholder)
- Focus ring: 2px solid green.900, offset 2px
