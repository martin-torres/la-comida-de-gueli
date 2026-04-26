# Implementation Plan: Sales & Marketing System

**Spec:** `docs/superpowers/specs/2026-04-25-sales-marketing-system-design.md`
**Date:** 2026-04-25
**Estimated Timeline:** 2-3 weeks (1 developer, part-time)

---

## Phase 1: Foundation (Week 1)

### Task 1.1: Create PocketBase `leads` Collection
**File:** `pocketbase/pb_migrations/` or admin UI
**What:** Create the leads collection schema as defined in the spec
**Fields:**
- restaurant_name (text, required)
- owner_name (text, required)
- phone (text, required, unique)
- email (email)
- current_pos (text)
- table_count (number)
- daily_customers (number)
- pain_scores (json)
- identified_modules (json)
- readiness_score (number)
- biggest_pain (text)
- source (select: landing_page | in_person | referral | walk_in)
- status (select: new | qualified | demo_scheduled | trial_started | closed_won | closed_lost | nurture)
- notes (text)
- assigned_to (relation → users)
- booked_demo_at (datetime)
- trial_ends_at (datetime)

**Validation:**
- Phone format validation (MX: +52 or 10 digits)
- Email format validation
- readiness_score between 0-100

**Success Criteria:** Can create, read, update leads via PocketBase API

---

### Task 1.2: Create Lead Repository Layer
**Files:**
- `src/data/contracts/leads-repo.ts` (interface)
- `src/data/pocketbase/leads-repo.ts` (implementation)
- `src/data/pocketbase/index.ts` (export)

**Interface:**
```typescript
interface LeadsRepo {
  create(lead: LeadInput): Promise<Lead>;
  getByPhone(phone: string): Promise<Lead | null>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
  list(filters?: LeadFilters): Promise<Lead[]>;
}
```

**Success Criteria:** All CRUD operations work with PocketBase

---

### Task 1.3: Add Landing Page Route
**Files:**
- `src/features/marketing/LandingPage.tsx` (main container)
- `App.tsx` (add route `/monterrey-mundial-2026`)

**Route:** `/monterrey-mundial-2026` or `/mundial-2026`
**Props:** None (self-contained)
**Requirements:**
- Public route (no auth)
- Mobile-first responsive
- SEO meta tags (title, description, OG image)

**Success Criteria:** Route loads, displays hero section

---

## Phase 2: Quiz Engine (Week 1-2)

### Task 2.1: Build Quiz Component
**File:** `src/features/marketing/components/Quiz.tsx`

**Structure:**
- 8 questions, one per screen
- Progress bar (question X of 8)
- Animated transitions between questions
- Answer options stored in component state

**Question Types:**
- Multiple choice (radio buttons)
- Slider (1-10 scale for some questions)
- Text input (restaurant name, phone, etc. — collected at end)

**Data Model:**
```typescript
interface QuizAnswers {
  ordering_method: 'waiter' | 'whatsapp' | 'phone' | 'walkout' | 'mixed';
  language_support: 'none' | 'partial' | 'full' | 'not_sure';
  has_analytics: boolean;
  staff_errors: 'rare' | 'weekly' | 'daily' | 'constant';
  customer_data: 'none' | 'some' | 'full' | 'not_sure';
  payment_time: '<1min' | '1-3min' | '3-5min' | '>5min';
  world_cup_prep: 'not_started' | 'planning' | 'ready' | 'not_thinking';
  marketing_capability: 'none' | 'social_media' | 'whatsapp' | 'full';
}
```

**Success Criteria:** All 8 questions display, answers collected, progress tracked

---

### Task 2.2: Build Scoring Engine
**File:** `src/features/marketing/lib/scoring.ts`

**Logic:**
- Map each answer to a score (0-20) per category
- Calculate total readiness score (0-100)
- Identify top 3 gaps (lowest scores)
- Map gaps to app modules

**Algorithm:**
```typescript
function calculateScore(answers: QuizAnswers): ScoreResult {
  const menuScore = calculateMenuScore(answers.language_support);
  const orderScore = calculateOrderScore(answers.ordering_method, answers.staff_errors);
  const retentionScore = calculateRetentionScore(answers.customer_data);
  const paymentScore = calculatePaymentScore(answers.payment_time);
  const analyticsScore = calculateAnalyticsScore(answers.has_analytics, answers.marketing_capability);
  
  return {
    menu: menuScore,
    orders: orderScore,
    retention: retentionScore,
    payment: paymentScore,
    analytics: analyticsScore,
    total: menuScore + orderScore + retentionScore + paymentScore + analyticsScore,
    gaps: getTop3Gaps({menu: menuScore, orders: orderScore, retention: retentionScore, payment: paymentScore, analytics: analyticsScore}),
    modules: mapGapsToModules(gaps)
  };
}
```

**Success Criteria:** Given test answers, produces correct score and gap analysis

---

### Task 2.3: Build Results Display
**File:** `src/features/marketing/components/Results.tsx`

**Sections:**
1. **Score Header**
   - Large animated score (0-100)
   - Score label: "Tu puntaje de preparación" / "Your readiness score"
   - Color-coded: red (0-49), yellow (50-79), green (80-100)

2. **Category Breakdown**
   - 5 horizontal bars showing category scores
   - Labels: Menu Accessibility, Order Efficiency, Customer Retention, Payment Speed, Data & Analytics
   - Visual: progress bars with colors

3. **Personalized Action Plan**
   - Top 3 gaps listed with severity
   - Each gap shows: "Your [Category] score is [X]/20"
   - Recommended module with 1-sentence description
   - Visual: cards or accordion

4. **CTA Section**
   - "Agenda tu demo" button → Calendly embed/modal
   - "Empieza gratis por 30 días" button → trial signup flow
   - "Descarga tu scorecard" button → PDF generation

**Success Criteria:** Results page renders correctly with sample data

---

## Phase 3: Lead Capture & Integrations (Week 2)

### Task 3.1: Build Lead Form
**File:** `src/features/marketing/components/LeadForm.tsx`

**Fields:**
- Restaurant name (text, required)
- Owner name (text, required)
- Phone (tel, required, MX format validation)
- Email (email, optional)
- Current POS (text, optional)
- Table count (number, optional)
- Daily customers (number, optional)

**Validation:**
- Phone: 10 digits or +52 prefix
- Email: standard format
- Required fields: restaurant_name, owner_name, phone

**UX:**
- Inline validation
- Error messages in Spanish
- Success state after submission

**Success Criteria:** Form validates and submits correctly

---

### Task 3.2: Integrate Calendly Booking
**File:** `src/features/marketing/components/BookingEmbed.tsx`

**Approach:**
- Use `react-calendly` package or Calendly inline embed
- Open in modal or new section after form submission
- Pass pre-filled data (name, email) to Calendly

**Config:**
- Calendly event type: "Demo La Comida de Gueli"
- Duration: 15 minutes
- Availability: Business hours (Mon-Sat, 9am-6pm)

**Success Criteria:** Booking widget loads, appointment created in Calendly

---

### Task 3.3: Build PDF Scorecard Generator
**File:** `src/features/marketing/lib/pdfGenerator.ts`

**Library:** `jspdf` or `@react-pdf/renderer`

**PDF Content:**
- Header: "World Cup Readiness Scorecard"
- Restaurant name and date
- Big score number (0-100)
- 5 category bars
- Top 3 gaps with recommendations
- CTA: QR code linking to booking page
- Footer: "Powered by La Comida de Gueli"

**Design:**
- Clean, professional
- Brand colors (primary/secondary from settings)
- Printable (A4 or letter size)

**Success Criteria:** PDF generates and downloads correctly

---

### Task 3.4: Submit Lead to PocketBase
**File:** `src/features/marketing/hooks/useLeadSubmission.ts`

**Flow:**
1. Collect quiz answers + lead form data
2. Calculate scores
3. Submit to PocketBase `leads` collection
4. Handle success/error states
5. Trigger Calendly open or PDF download based on CTA

**Hook API:**
```typescript
function useLeadSubmission() {
  const submit = async (data: LeadSubmissionData) => Promise<Lead>;
  const isLoading: boolean;
  const error: Error | null;
  return { submit, isLoading, error };
}
```

**Success Criteria:** Lead created in PocketBase with all fields populated

---

## Phase 4: Admin Lead Management (Week 2-3)

### Task 4.1: Build Leads List View
**File:** `src/features/admin/pages/LeadsPage.tsx`

**Columns:**
- Restaurant name
- Owner name
- Phone
- Readiness score (color-coded)
- Status (badge)
- Source
- Created date
- Actions (view, edit, delete)

**Features:**
- Sort by score, date, status
- Filter by status, source, score range
- Search by name/phone
- Pagination

**Success Criteria:** Can view, sort, filter leads

---

### Task 4.2: Build Lead Detail View
**File:** `src/features/admin/components/LeadDetail.tsx`

**Sections:**
- Contact info (editable)
- Quiz results (read-only)
- Score breakdown (visual bars)
- Identified modules (tags)
- Status history (timeline)
- Notes (editable text area)
- Actions: update status, assign to user, book demo

**Success Criteria:** Can view and edit lead details

---

### Task 4.3: Add Leads to Admin Navigation
**File:** `src/features/admin/components/AdminLayout.tsx`

**Changes:**
- Add "Leads" link to sidebar
- Icon: Users or Target
- Route: `/admin/leads`

**Success Criteria:** Leads page accessible from admin dashboard

---

## Phase 5: Sales Deck & Script (Week 3)

### Task 5.1: Create Sales Deck
**Tool:** Google Slides or Canva (non-code deliverable)
**Template:** 12 slides as defined in spec

**Slides:**
1. Title: "¿Tu restaurante está listo para el Mundial 2026?"
2. The Opportunity (World Cup numbers)
3. The 5 Killers (pain icons)
4-8. Pain + Module (one per slide)
9. Highest Paid Billboard frame
10. Pricing anchor
11. Social proof
12. CTA with QR code

**Assets needed:**
- App screenshots/mockups
- World Cup graphics (official or generic)
- Restaurant photos (stock or real)
- Brand colors (from settings)

**Success Criteria:** 12-slide deck ready for tablet presentation

---

### Task 5.2: Write Printed Sales Script
**File:** `docs/sales/script-v1.md` (or printed 1-pager)

**Format:**
- Laminated A4 or letter size
- Double-sided or foldable
- Large font for easy reading

**Sections:**
1. Opening (30 sec)
2. 8 diagnostic questions with space for notes
3. Transition phrases
4. Module demos (key talking points)
5. Objection handlers (quick reference)
6. Closing (3 options: demo, trial, leave-behind)

**Success Criteria:** Script printed and ready for field use

---

## Phase 6: Polish & Analytics (Week 3)

### Task 6.1: Add Analytics Tracking
**File:** `src/features/marketing/lib/analytics.ts`

**Events to track:**
- `quiz_started`
- `quiz_question_N_answered` (for each question)
- `quiz_completed`
- `score_calculated` (with score value)
- `lead_form_submitted`
- `demo_booked`
- `pdf_downloaded`
- `trial_started`

**Implementation:**
- Google Analytics 4 events
- Or simple internal analytics to PocketBase
- Track drop-off points in quiz

**Success Criteria:** Events fire correctly, data visible in dashboard

---

### Task 6.2: SEO & Meta Tags
**File:** `index.html` or React Helmet

**Meta tags:**
- Title: "¿Tu restaurante está listo para el Mundial 2026? | La Comida de Gueli"
- Description: "Descubre tu puntaje de preparación para el Mundial 2026. Diagnóstico gratuito para restaurantes en Monterrey."
- OG image: Hero image with World Cup + app mockup
- OG title/description
- Canonical URL

**Success Criteria:** Social shares render correctly, Google indexes page

---

### Task 6.3: Mobile Optimization & Testing
**Tasks:**
- Test on iPhone Safari, Android Chrome
- Test quiz flow on slow 3G
- Test Calendly embed on mobile
- Test PDF download on mobile
- Fix any layout issues

**Success Criteria:** Smooth experience on all major mobile browsers

---

## Dependencies to Install

```bash
# Calendly embed
npm install react-calendly

# PDF generation
npm install jspdf html2canvas
# OR
npm install @react-pdf/renderer

# Animations (if not already installed)
npm install framer-motion

# Phone validation
npm install libphonenumber-js
```

---

## Files to Create/Modify

### New Files
```
src/features/marketing/
  ├── LandingPage.tsx
  ├── components/
  │   ├── Quiz.tsx
  │   ├── Results.tsx
  │   ├── LeadForm.tsx
  │   ├── BookingEmbed.tsx
  │   └── ScoreCard.tsx
  ├── lib/
  │   ├── scoring.ts
  │   ├── pdfGenerator.ts
  │   └── analytics.ts
  └── hooks/
      └── useLeadSubmission.ts

src/data/contracts/leads-repo.ts
src/data/pocketbase/leads-repo.ts
src/features/admin/pages/LeadsPage.tsx
src/features/admin/components/LeadDetail.tsx
```

### Modified Files
```
src/App.tsx (add route)
src/features/admin/components/AdminLayout.tsx (add nav)
src/data/pocketbase/index.ts (export leads repo)
index.html (meta tags)
```

---

## Success Criteria (Overall)

- [ ] Quiz completes without errors on mobile
- [ ] Score calculates correctly for all answer combinations
- [ ] Lead submits to PocketBase with all fields
- [ ] Calendly booking opens and pre-fills data
- [ ] PDF scorecard downloads correctly
- [ ] Admin can view, sort, filter leads
- [ ] Sales deck is ready for presentation
- [ ] Printed script is ready for field use
- [ ] Analytics track quiz drop-off and conversions
- [ ] Page loads in <3 seconds on 3G

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Restaurant owners don't complete long quiz | Show progress bar, allow save/resume, keep under 3 minutes |
| Calendly booking conflicts | Set buffer time, limit daily demos, use scheduling rules |
| PDF generation fails on mobile | Fallback: email scorecard instead of download |
| Low conversion from quiz to lead | Make form short (name, phone only), ask rest after booking |
| Owners don't understand scoring | Use plain language, visual bars, concrete examples |

---

**Next Step:** Begin Phase 1, Task 1.1 (Create PocketBase `leads` collection)
