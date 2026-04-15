# Feature 01 — Authentication

**App:** Owner + Trainer (app.lafattoria.ch)
**Depends on:** Supabase Auth, `profiles` table
**Blocks:** All other features

---

## Overview

Two auth flows:
1. **Owner / Trainer** — email + password, role-based access
2. **Client** — magic link (covered in Feature 10)

---

## Files to Create

```
apps/owner/app/(auth)/
├── login/
│   └── page.tsx          ← Login page
├── logout/
│   └── route.ts          ← GET /logout → clear session
└── callback/
    └── route.ts          ← Supabase OAuth callback

apps/owner/
├── middleware.ts          ← Protect all routes, check role
├── lib/
│   ├── supabase.ts       ← createServerClient, createBrowserClient
│   └── auth.ts           ← getCurrentUser(), requireRole()

apps/owner/app/(auth)/login/
└── components/
    └── login-form.tsx    ← 'use client' form
```

---

## Login Page Design

```
Background: cream.50 (#F5F0E8)
Center card: white, border, border-radius 4px, padding 48px

Logo SVG (100px wide)
Subtitle: "Gestione Stalla" (12px, muted)

Form:
  Label: "Email" (11px uppercase, muted)
  Input: email type
  Label: "Password" (11px uppercase, muted)
  Input: password type
  Error: 12px red, below input
  Button: "Accedi" full width, green.900

Font: Georgia for logo/title, system-ui for form
```

---

## Middleware

```ts
// apps/owner/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(/* ... */)
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/(auth)')
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)'],
}
```

---

## Auth Helpers

```ts
// apps/owner/lib/auth.ts
import { createServerClient } from './supabase'
import { redirect } from 'next/navigation'
import type { UserRole } from '@lafattoria/supabase'

export async function getCurrentUser() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return profile
}

export async function requireRole(roles: UserRole[]) {
  const user = await getCurrentUser()
  if (!user || !roles.includes(user.role as UserRole)) {
    redirect('/login')
  }
  return user
}
```

---

## Trainer Invite Flow (Owner only)

Owner can invite a trainer from Settings:
1. Owner enters trainer email in Settings
2. Server Action calls `supabase.auth.admin.inviteUserByEmail(email)`
3. Trainer receives email with magic link
4. On first login, trainer sets password and sees their profile pre-created with `role: 'trainer'`

---

## Session Management

- Sessions are stored in httpOnly cookies via `@supabase/ssr`
- Auto-refresh handled by Supabase middleware helper
- On 401 from any query → middleware redirects to `/login`

---

## Unit Tests

```ts
// features/auth/auth.test.ts

describe('requireRole', () => {
  it('redirects if user has wrong role', async () => {
    mockUser({ role: 'trainer' })
    await expect(requireRole(['owner'])).rejects.toThrow()
  })

  it('returns user if role matches', async () => {
    mockUser({ role: 'owner' })
    const user = await requireRole(['owner'])
    expect(user.role).toBe('owner')
  })
})
```

---

## Acceptance Criteria

- [ ] Owner can log in with email + password
- [ ] Trainer can log in with email + password
- [ ] Wrong password shows error message (Italian: "Email o password errati")
- [ ] Accessing any protected route without session redirects to `/login`
- [ ] Trainer accessing billing routes redirects to `/dashboard` with a notice
- [ ] Owner can invite a trainer via email
- [ ] Logout clears session and redirects to `/login`
- [ ] Session persists on page refresh
