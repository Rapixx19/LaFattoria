# La Fattoria — Integration Tests

All integration tests live in `[feature]/[feature].integration.test.ts`.
Run with: `pnpm test:integration`

---

## Test Environment Setup

```ts
// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
  },
}

// tests/setup.ts
import { createClient } from '@supabase/supabase-js'

// Use a dedicated test Supabase project or test schema
export const supabase = createClient(
  process.env.TEST_SUPABASE_URL!,
  process.env.TEST_SUPABASE_SERVICE_ROLE_KEY!
)

// Clean test data before each suite
export async function cleanTestData() {
  await supabase.from('bills').delete().like('number', 'TEST-%')
  await supabase.from('bookings').delete().eq('notes', '__test__')
}
```

---

## Suite 1: Auth ↔ RLS

```ts
// tests/auth-rls.integration.test.ts

describe('RLS: Owner access', () => {
  it('owner can read all clients', async () => {
    const { data, error } = await supabaseAs('owner').from('clients').select()
    expect(error).toBeNull()
    expect(data!.length).toBeGreaterThan(0)
  })

  it('owner can read all bills', async () => {
    const { data, error } = await supabaseAs('owner').from('bills').select()
    expect(error).toBeNull()
  })

  it('owner can create and update services', async () => {
    const { error } = await supabaseAs('owner').from('services')
      .insert({ art_code: 'TEST', name: 'Test Service', unit: 'volta', price: 10, vat_rate: 8.1 })
    expect(error).toBeNull()
  })
})

describe('RLS: Trainer access', () => {
  it('trainer can read all bookings', async () => {
    const { data, error } = await supabaseAs('trainer').from('bookings').select()
    expect(error).toBeNull()
  })

  it('trainer cannot read bills', async () => {
    const { data, error } = await supabaseAs('trainer').from('bills').select()
    expect(data).toHaveLength(0) // RLS filters to zero, not error
  })

  it('trainer cannot create services', async () => {
    const { error } = await supabaseAs('trainer').from('services')
      .insert({ art_code: 'TEST', name: 'X', unit: 'x', price: 10, vat_rate: 0 })
    expect(error).not.toBeNull()
  })
})

describe('RLS: Client access', () => {
  it('client can only read own bills', async () => {
    const { data } = await supabaseAs('client-A').from('bills').select()
    data!.forEach(bill => expect(bill.client_id).toBe(TEST_CLIENT_A_ID))
  })

  it('client cannot read another client bills', async () => {
    const { data } = await supabaseAs('client-A').from('bills')
      .select().eq('client_id', TEST_CLIENT_B_ID)
    expect(data).toHaveLength(0)
  })

  it('client can only read own horse', async () => {
    const { data } = await supabaseAs('client-A').from('horses').select()
    data!.forEach(h => expect(h.client_id).toBe(TEST_CLIENT_A_ID))
  })

  it('client can create a booking for themselves', async () => {
    const { error } = await supabaseAs('client-A').from('bookings').insert({
      client_id: TEST_CLIENT_A_ID,
      service_id: TEST_SERVICE_ID,
      scheduled_date: '2026-05-01',
      scheduled_time: '10:00',
      notes: '__test__',
    })
    expect(error).toBeNull()
  })

  it('client cannot create a booking for another client', async () => {
    const { error } = await supabaseAs('client-A').from('bookings').insert({
      client_id: TEST_CLIENT_B_ID, // wrong client
      service_id: TEST_SERVICE_ID,
      scheduled_date: '2026-05-01',
      scheduled_time: '10:00',
    })
    expect(error).not.toBeNull()
  })
})
```

---

## Suite 2: Billing ↔ Clients

```ts
// features/billing/billing-clients.integration.test.ts

describe('Billing ↔ Clients', () => {
  it('bill stores client snapshot at creation time', async () => {
    const bill = await createTestBill({ clientId: TEST_CLIENT_ID })
    expect(bill.client_snapshot).toMatchObject({
      id: TEST_CLIENT_ID,
      name: expect.any(String),
    })
  })

  it('updating client name does not change old bill snapshot', async () => {
    const bill = await createTestBill({ clientId: TEST_CLIENT_ID })
    const originalName = bill.client_snapshot.name
    await updateClientName(TEST_CLIENT_ID, 'New Name')
    const refetched = await getBill(bill.id)
    expect(refetched.client_snapshot.name).toBe(originalName)
  })

  it('client profile shows all their bills', async () => {
    await createTestBill({ clientId: TEST_CLIENT_ID, number: 'TEST-001' })
    await createTestBill({ clientId: TEST_CLIENT_ID, number: 'TEST-002' })
    const bills = await getBillsByClient(TEST_CLIENT_ID)
    expect(bills.length).toBeGreaterThanOrEqual(2)
    bills.forEach(b => expect(b.client_id).toBe(TEST_CLIENT_ID))
  })

  it('deleting a client is blocked if bills exist', async () => {
    await createTestBill({ clientId: TEST_CLIENT_ID })
    const { error } = await supabase.from('clients').delete()
      .eq('id', TEST_CLIENT_ID)
    expect(error).not.toBeNull() // ON DELETE RESTRICT
  })
})
```

---

## Suite 3: Billing ↔ Services

```ts
// features/billing/billing-services.integration.test.ts

describe('Billing ↔ Services', () => {
  it('bill items use price at time of creation, not current price', async () => {
    const serviceId = TEST_SERVICE_ID
    await setServicePrice(serviceId, 100.00)
    const bill = await createTestBill({ items: [{ serviceId, qty: 1 }] })
    await setServicePrice(serviceId, 200.00) // change after bill created
    const refetched = await getBill(bill.id)
    expect(refetched.items[0].price).toBe(100.00) // snapshot unchanged
  })

  it('deactivating a service does not affect existing bills', async () => {
    const bill = await createTestBill({ items: [{ serviceId: TEST_SERVICE_ID }] })
    await deactivateService(TEST_SERVICE_ID)
    const refetched = await getBill(bill.id)
    expect(refetched.items[0].name).toBeTruthy()
  })

  it('service price change is recorded in price_history', async () => {
    await setServicePrice(TEST_SERVICE_ID, 150.00, 'test-user-id')
    const { data } = await supabase.from('services')
      .select('price_history').eq('id', TEST_SERVICE_ID).single()
    const history = data!.price_history as Array<{price: number}>
    expect(history.some(h => h.price === 150.00)).toBe(true)
  })
})
```

---

## Suite 4: Billing ↔ Revenue

```ts
// features/revenue/revenue-billing.integration.test.ts

describe('Revenue ↔ Billing', () => {
  it('new bill appears in monthly revenue chart', async () => {
    const bill = await createTestBill({ date: '2026-03-15' })
    const revenue = await getRevenueByMonth(2026)
    const march = revenue.find(r => r.month === 3)
    expect(march!.bill_count).toBeGreaterThan(0)
  })

  it('marking bill paid updates paid revenue', async () => {
    const bill = await createTestBill({ date: '2026-03-15', status: 'pending' })
    const before = await getRevenueByMonth(2026)
    const marchBefore = before.find(r => r.month === 3)

    await markBillPaid(bill.id, { amount: bill.total, date: '2026-03-20' })

    const after = await getRevenueByMonth(2026)
    const marchAfter = after.find(r => r.month === 3)
    expect(marchAfter!.paid).toBeGreaterThan(marchBefore!.paid)
  })

  it('imported bill is included in revenue but not in invoice numbering', async () => {
    const imported = await createImportedBill({ date: '2025-06-01' })
    expect(imported.source).toBe('imported')

    const revenue2025 = await getRevenueByMonth(2025)
    const june = revenue2025.find(r => r.month === 6)
    expect(june!.bill_count).toBeGreaterThan(0)

    // Auto-numbering should not count imported bills
    const nextNum = await getNextBillNumber(2026)
    expect(nextNum).not.toContain('imported')
  })

  it('bills marked overdue after 30 days appear in overdue revenue', async () => {
    await createTestBill({ date: '2025-12-01', status: 'pending' })
    await markOverdueBills() // run the function
    const revenue = await getRevenueByMonth(2025)
    const dec = revenue.find(r => r.month === 12)
    expect(dec!.overdue).toBeGreaterThan(0)
  })
})
```

---

## Suite 5: Booking ↔ Schedule

```ts
// features/booking/booking-schedule.integration.test.ts

describe('Booking ↔ Schedule', () => {
  it('confirmed booking appears on schedule for that date', async () => {
    const booking = await createTestBooking({
      scheduled_date: '2026-05-10',
      scheduled_time: '10:00',
      status: 'requested',
    })
    await confirmBooking(booking.id)
    const schedule = await getScheduleForDate('2026-05-10')
    expect(schedule.some(s => s.id === booking.id)).toBe(true)
  })

  it('cancelled booking does not appear on schedule', async () => {
    const booking = await createTestBooking({ scheduled_date: '2026-05-10' })
    await cancelBooking(booking.id)
    const schedule = await getScheduleForDate('2026-05-10')
    expect(schedule.find(s => s.id === booking.id)?.status).not.toBe('confirmed')
  })

  it('two bookings at same time and trainer are blocked', async () => {
    await createTestBooking({
      scheduled_date: '2026-05-10',
      scheduled_time: '10:00',
      trainer_id: TEST_TRAINER_ID,
      status: 'confirmed',
    })
    // Application layer should prevent this (not DB constraint)
    const conflict = await checkConflict({
      date: '2026-05-10',
      time: '10:00',
      trainerId: TEST_TRAINER_ID,
    })
    expect(conflict).toBe(true)
  })
})
```

---

## Suite 6: Booking ↔ Billing (auto-bill)

```ts
// features/booking/booking-billing.integration.test.ts

describe('Booking → Billing (quick bill from session)', () => {
  it('completing a session can generate a draft bill', async () => {
    const booking = await createTestBooking({ status: 'confirmed' })
    const bill = await createBillFromBooking(booking.id)
    expect(bill.items[0].name).toBe(booking.service_name)
    expect(bill.client_id).toBe(booking.client_id)
    expect(bill.type).toBe('extra')
  })

  it('bill linked to booking via bill_id', async () => {
    const booking = await createTestBooking({ status: 'confirmed' })
    const bill = await createBillFromBooking(booking.id)
    const { data } = await supabase.from('bookings')
      .select('bill_id').eq('id', booking.id).single()
    expect(data!.bill_id).toBe(bill.id)
  })
})
```

---

## Suite 7: Client PWA ↔ Booking Engine

```ts
// features/client-pwa/client-booking.integration.test.ts

describe('Client PWA ↔ Booking Engine', () => {
  it('client can request a booking and sees it as requested', async () => {
    const booking = await clientRequestBooking({
      clientId: TEST_CLIENT_ID,
      serviceId: TEST_SERVICE_ID,
      date: '2026-05-20',
      time: '14:00',
    })
    expect(booking.status).toBe('requested')
  })

  it('owner confirming booking updates status visible to client', async () => {
    const booking = await clientRequestBooking({ ... })
    await ownerConfirmBooking(booking.id)
    const clientView = await supabaseAs('client-A').from('bookings')
      .select().eq('id', booking.id).single()
    expect(clientView.data!.status).toBe('confirmed')
  })

  it('client cannot book a slot that is already confirmed', async () => {
    await createConfirmedBooking({
      date: '2026-05-20', time: '10:00', serviceId: TEST_SERVICE_ID
    })
    const available = await getAvailableSlots('2026-05-20', TEST_SERVICE_ID)
    expect(available.some(s => s.time === '10:00')).toBe(false)
  })
})
```

---

## Suite 8: Client PWA ↔ Billing

```ts
// features/client-pwa/client-billing.integration.test.ts

describe('Client PWA ↔ Billing', () => {
  it('client sees own bills with correct amounts', async () => {
    const bill = await createTestBill({ clientId: TEST_CLIENT_ID })
    const clientBills = await supabaseAs('client-A').from('bills')
      .select().eq('client_id', TEST_CLIENT_ID)
    expect(clientBills.data!.some(b => b.id === bill.id)).toBe(true)
  })

  it('client cannot see bills for other clients', async () => {
    await createTestBill({ clientId: TEST_CLIENT_B_ID })
    const clientABills = await supabaseAs('client-A').from('bills').select()
    const hasBillB = clientABills.data!.some(b => b.client_id === TEST_CLIENT_B_ID)
    expect(hasBillB).toBe(false)
  })

  it('PDF download URL is accessible to the bill client', async () => {
    const bill = await createTestBill({ clientId: TEST_CLIENT_ID })
    const pdf = await generateAndStorePDF(bill.id)
    expect(pdf.url).toBeTruthy()
    // URL should be signed and time-limited
    expect(pdf.url).toContain('supabase')
  })
})
```

---

## E2E Tests (Playwright)

```ts
// tests/e2e/create-bill.spec.ts
test('owner can create and print a mensile bill', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'owner@lafattoria.ch')
  await page.fill('[name=password]', process.env.TEST_OWNER_PASSWORD!)
  await page.click('button[type=submit]')
  await page.waitForURL('/dashboard')

  await page.click('text=+ Nuova Fattura')
  await page.click('text=Mensile')
  await page.click(`text=Sofia Mazzini`)
  await page.click('text=Pensione')
  await page.click('text=Salva')
  await page.waitForURL(/\/billing\//)
  await expect(page.locator('text=CHF 1\'475')).toBeVisible()
})

// tests/e2e/client-book.spec.ts
test('client can request a booking', async ({ page }) => {
  await page.goto('https://mio.lafattoria.ch')
  await page.click('text=Prenota')
  await page.click('text=Lezione privata')
  await page.click('[data-date="2026-05-20"]')
  await page.click('text=Richiedi sessione')
  await expect(page.locator('text=Richiesta inviata')).toBeVisible()
})
```

---

## Running Tests

```bash
# Unit tests only
pnpm test

# Integration tests (requires TEST_SUPABASE_URL set)
pnpm test:integration

# E2E tests (requires both apps running)
pnpm test:e2e

# All
pnpm test:all

# Watch mode
pnpm test --watch
```
