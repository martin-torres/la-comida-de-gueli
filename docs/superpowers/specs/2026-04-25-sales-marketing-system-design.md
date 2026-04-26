# Design Spec: Sales & Marketing System for La Comida de Gueli PWA

**Date:** 2026-04-25
**Project:** La Comida de Gueli (formerly El Arrocito) — Restaurant PWA
**Goal:** Build a diagnostic sales framework that asks questions, gathers prospect intelligence, and positions each app module as the solution to a specific restaurant pain point. Uses Jeremy Miner NEPQ style + Hormozi value stacking.

---

## 1. Context & Opportunity

### The World Cup 2026 Hook
- **Location:** Monterrey, Mexico (host city)
- **Tourist influx:** 5+ million visitors over the tournament
- **Restaurant reality:** Most small-medium restaurants have no digital presence, no multilingual support, no customer data
- **Window:** ~12 months to capture market before June 2026

### The "Highest Paid Billboard" Frame
A billboard on Constitución costs $50,000–$80,000 MXN/month. People drive by at 60 km/h and maybe glance. The app lives on the customer's phone — the most valuable real estate in the world. It remembers them. It brings them back. It can't be thrown away like a flyer or skipped like a Facebook ad.

**Math:** 100 customers/day × 30% reorder rate = 900 extra orders/month from existing customers. A billboard never does that.

---

## 2. Target Audience

**Primary:** Small-medium restaurant owners in Monterrey (5–50 tables, family-owned, no tech team)
**Secondary:** Restaurant managers/franchise operators preparing for World Cup

**Psychographic profile:**
- Skeptical of "apps" — they've been burned by expensive POS systems
- Busy — they'll give you 15 minutes, not an hour
- Relationship-driven — they buy from people they trust
- Pain-aware but solution-naive — they know rush hour is chaos, they don't know QR ordering exists
- Price-sensitive but value-receptive — anchor to cost of billboard, not to "cheap software"

---

## 3. The Diagnostic Framework (NEPQ)

### Phase 1: SITUATION — "What exists now?"

**Question 1 — Ordering Channel:**
> "How do your customers currently place orders — waiter, WhatsApp, phone, or do they just walk out when the line is long?"
- *Maps to:* QR Self-Ordering module
- *Data captured:* Current ordering method, peak chaos level

**Question 2 — Language Barrier:**
> "When tourists or English/Korean speakers come in, how do they figure out your menu? Do you have photos, translations, or do you lose them?"
- *Maps to:* Multilingual Menu (ES/EN/KO) module
- *Data captured:* Current multilingual capability, estimated tourist traffic

**Question 3 — Business Intelligence:**
> "How do you currently track which dishes sell best, which hours are dead, and whether your promotions actually work?"
- *Maps to:* Analytics Dashboard module
- *Data captured:* Current data practices, pain level around guessing

### Phase 2: PROBLEM — "What hurts?"

**Question 4 — Staff Errors:**
> "What happens when your staff is overwhelmed during rush hour — do orders get written down wrong, forgotten, or delayed?"
- *Maps to:* QR Self-Ordering + Kitchen Display modules
- *Data captured:* Error frequency, staff turnover, training costs

**Question 5 — Customer Retention:**
> "How many times a month do customers say 'I'll come back' and you never see them again? Do you have their phone number or any way to bring them back?"
- *Maps to:* Customer Database + Retargeting module
- *Data captured:* Current retention rate, existing customer data

**Question 6 — Payment Friction:**
> "When someone asks for the bill or wants to pay with card/Oxxo/transfer, how long does that whole dance take?"
- *Maps to:* Multi-Payment Checkout module
- *Data captured:* Current payment methods, average checkout time

### Phase 3: IMPLICATION — "What does it cost you?"

**Question 7 — World Cup Competition:**
> "With the World Cup coming in 2026, every restaurant in Monterrey will be fighting for the same tourists. If a Korean or American family sits down and can't read your menu or pay easily, where do you think they'll go next time?"
- *Maps to:* All modules (especially Multilingual + Payment)
- *Data captured:* Awareness of World Cup opportunity, competitive anxiety

**Question 8 — Lost Revenue:**
> "If you had a list of every customer who's ordered from you with their phone number and favorite dishes, how much more could you make by sending them a 'come back' message on a slow Tuesday?"
- *Maps to:* Customer Database + Promotions Engine
- *Data captured:* Estimated value of retention, interest in marketing automation

### Phase 4: NEED-PAYOFF — "Here's the solution"

After the prospect feels the pain, reveal the solution module by module:
> "You told me [their #1 pain]. Here's exactly how the app fixes that..."

Each module is presented as a **painkiller**, not a **vitamin**.

---

## 4. Problem → Module Mapping

| Pain Discovered | App Module | Value Proposition | Script Transition |
|---|---|---|---|
| Staff overwhelmed, orders wrong | **QR Self-Ordering** | Customers order from their own phone. No writing, no shouting, no mistakes. One waiter covers 3x more tables. | "You said rush hour is chaos — what if customers ordered themselves?" |
| Tourists can't read menu, walk out | **Multilingual Menu** | Your menu speaks their language. Photos + translations = they order confidently. World Cup = 5M+ tourists. | "You said tourists leave confused — what if your menu spoke Korean?" |
| No idea what sells, dead hours unknown | **Analytics Dashboard** | See exactly what sells, when, and why. Know peak hours, dead dishes, real margins. Data you can't get from a notebook. | "You said you guess — what if you knew?" |
| Customers never come back | **Customer Database** | Every order captures their phone + favorites. Send a WhatsApp: 'Your favorite tacos are 20% off today.' That's a superpower. | "You said they disappear — what if you could call them back?" |
| Payment takes 5 min per table | **Multi-Payment Checkout** | Card, Oxxo, MercadoPago, CoDi, cash — all in one flow. Table turns faster. Tips often go up. | "You said payment is a dance — what if it was one tap?" |
| Promotions are guesswork | **Smart Promotions Engine** | BOGO, free drinks, combos. Set them, track them, know which ones print money. | "You said you don't know what works — what if you did?" |
| Delivery orders chaos | **Delivery/Takeout/Dine-in** | One system handles all three. Delivery fees auto-calculated. No more 'where's my order?' calls. | "You said delivery is a mess — what if it was automatic?" |
| Kitchen doesn't know what's cooking | **Kitchen Display System** | Orders appear instantly. Prioritized by time. No paper tickets. No 'did you get my order?' | "You said orders get lost — what if the kitchen saw them instantly?" |

---

## 5. The World Cup Urgency Narrative

### Short-Term Benefit (2026)
5+ million tourists will visit Monterrey. They have money. They are hungry. They will choose the restaurant where they can:
1. Read the menu in their language
2. Order without a language barrier
3. Pay with their preferred method
4. Get their food fast and track it

**If your competitor has this and you don't, where do tourists go?**

### Long-Term Game (2027+)
During the World Cup, every restaurant with a digital menu will be photographed, shared on Instagram, reviewed on Google. Tourists go home and tell friends. Local customers get used to the convenience and expect it forever. You don't just capture World Cup revenue — you capture the habit.

**The app is not a cost. It's the highest-paid billboard on the most valuable real estate in the world — your customer's phone.**

---

## 6. Lead Capture Mechanism

### The "World Cup Readiness Score"

After answering the 8 diagnostic questions, the prospect receives a personalized score (0-100):

| Category | Points | Question Source |
|---|---|---|
| Menu Accessibility | 0-20 | Q2 (language barrier) |
| Order Efficiency | 0-20 | Q1, Q4 (ordering chaos) |
| Customer Retention | 0-20 | Q5 (lost customers) |
| Payment Speed | 0-20 | Q6 (payment friction) |
| Data & Analytics | 0-20 | Q3, Q8 (blindness) |

**Score interpretation:**
- 80-100: "You're almost ready. 2-3 modules will close the gap."
- 50-79: "You have a solid foundation, but World Cup tourists will expose the cracks."
- 0-49: "Without action, you're invisible to 5 million tourists."

### Personalized Action Plan
Based on their lowest 3 scores, generate a prioritized list:
> "Your biggest gap is Customer Retention (3/20). The Customer Database module fixes this by capturing every customer's phone and favorite dishes, so you can bring them back on slow days."

### CTA Hierarchy
1. **Primary:** "Book a 15-minute demo" (links to Calendly/Cal.com)
2. **Secondary:** "Start free for 30 days — pay after World Cup if you love it"
3. **Tertiary:** "Download the scorecard PDF" (lead magnet for non-committal prospects)

### Data Captured (Lead Profile)
- Restaurant name
- Owner/manager name
- Phone number
- Email
- Current POS system (if any)
- Number of tables
- Average daily customers
- Biggest pain point (lowest score category)
- Identified modules (array of module IDs)
- World Cup Readiness Score
- Source (landing_page | in_person | referral)

---

## 7. Deliverables

### Deliverable 1: Diagnostic Landing Page

**URL:** `/monterrey-mundial-2026` or `/restaurante-mundial-2026`
**Tech:** React page added to existing PWA (or separate static site)

**Structure:**
1. **Hero Section**
   - Headline: *"¿Tu restaurante está listo para 5 millones de turistas?"* / *"Is your restaurant ready for 5 million tourists?"*
   - Subhead: *"Descubre tu puntaje de preparación para el Mundial 2026 en 2 minutos."*
   - CTA: "Empezar diagnóstico gratis" / "Start free diagnosis"
   - Visual: World Cup trophy + phone with app mockup

2. **Social Proof / Urgency Bar**
   - "El Mundial llega en [X] días. Los restaurantes que se preparan ahora capturarán a los turistas primero."

3. **Quiz Section (8 Questions)**
   - One question per screen with progress bar
   - Mobile-first design (restaurant owners browse on phones)
   - Animated transitions
   - Answers stored in local state, submitted at end

4. **Results Section**
   - World Cup Readiness Score (animated counter)
   - 5-category breakdown with visual bars
   - Personalized action plan (top 3 gaps)
   - Module recommendations with mini-descriptions

5. **CTA Section**
   - "Agenda tu demo" (calendar booking)
   - "Empieza gratis por 30 días" (trial signup)
   - "Descarga tu scorecard" (PDF generation)

6. **FAQ / Objection Handlers**
   - "¿Es caro?" → "Less than a billboard. And it brings customers back."
   - "¿Necesito internet?" → "Works offline. Syncs when connected."
   - "¿Y si no me gusta?" → "30 days free. Cancel anytime."

**Technical requirements:**
- Integrate with existing PocketBase `leads` collection
- Calendly/Cal.com embed for booking
- PDF generation library (e.g., jspdf, html2pdf) for scorecard
- Form validation and phone mask for MX numbers
- Analytics events (question completion, score calculation, CTA clicks)

### Deliverable 2: Sales Script + Slide Deck

**Script format:** Printed 1-page laminated card or digital tablet script
**Deck format:** 12 slides, 16:9, designed for tablet or laptop

**Slide-by-slide breakdown:**

| Slide | Title | Content | Duration |
|---|---|---|---|
| 1 | The Opportunity | World Cup 2026 numbers: 5M tourists, $2B+ spending, Monterrey as host city | 1 min |
| 2 | The 5 Killers | Visual: 5 icons representing the top restaurant pains (language, chaos, retention, payments, blindness) | 1 min |
| 3 | Pain #1: Language Barrier | Question 2 recap + Multilingual Menu module demo | 2 min |
| 4 | Pain #2: Rush Hour Chaos | Question 4 recap + QR Self-Ordering + Kitchen Display demo | 2 min |
| 5 | Pain #3: Lost Customers | Question 5 recap + Customer Database + Retargeting demo | 2 min |
| 6 | Pain #4: Payment Friction | Question 6 recap + Multi-Payment Checkout demo | 2 min |
| 7 | Pain #5: Flying Blind | Question 3/8 recap + Analytics + Promotions Engine demo | 2 min |
| 8 | The Highest Paid Billboard | Frame: app vs billboard cost comparison. Customer phone = best real estate. | 1 min |
| 9 | Pricing Anchor | "A billboard costs $60K/month. The app costs $X/month. And the billboard can't send a 'come back' message." | 1 min |
| 10 | Social Proof | Testimonials, case studies, early restaurant partners | 1 min |
| 11 | Guarantee | "30 days free. No credit card. If you don't make more money, you don't pay." | 30 sec |
| 12 | CTA | "Start now. Be ready before June 2026." QR code to signup. | 30 sec |

**Total pitch time:** ~15 minutes

### Deliverable 3: Lead Database Schema

**New PocketBase collection: `leads`**

```
- id (auto)
- restaurant_name (text, required)
- owner_name (text, required)
- phone (text, required, validated MX format)
- email (email, optional)
- current_pos (text, optional) — "none", " handwritten", "Square", "Clover", etc.
- table_count (number, optional)
- daily_customers (number, optional)
- pain_scores (json) — { menu: 3, orders: 7, retention: 2, payment: 5, analytics: 4 }
- identified_modules (json array) — ["multilingual_menu", "qr_ordering", "analytics"]
- readiness_score (number, 0-100)
- biggest_pain (text) — lowest score category name
- source (select: landing_page | in_person | referral | walk_in)
- status (select: new | qualified | demo_scheduled | trial_started | closed_won | closed_lost | nurture)
- notes (text, optional)
- assigned_to (relation to users, optional)
- booked_demo_at (datetime, optional)
- trial_ends_at (datetime, optional)
- created (auto)
- updated (auto)
```

**Indexes:**
- phone (unique)
- status + source (compound)
- readiness_score (for prioritizing hot leads)

---

## 8. Objection Handling Script

| Objection | Response |
|---|---|
| "Es muy caro." | "¿Cuánto cuesta un letrero en Constitución? $60 mil al mes. Y la gente pasa a 60 km/h. Esta app está en el teléfono de tu cliente. Le recuerda tu restaurante cada vez que tiene hambre. ¿Cuántos clientes extra necesitas para pagarla?" |
| "No tengo tiempo." | "Te entiendo. El Mundial llega en X meses. Los restaurantes que empiezan ahora tendrán los turistas primero. Los que esperan... competirán con todos los demás. ¿Qué te cuesta más: 30 minutos hoy, o perder turistas en junio?" |
| "No necesito tecnología." | "Claro que no. Hasta ahora has sobrevivido sin ella. Pero el Mundial no es negocio normal. Van a llegar 5 millones de personas que no hablan español, no conocen tu menú, y van a elegir el restaurante que les haga la vida fácil. ¿Quieres ser ese restaurante, o el de al lado?" |
| "Ya tengo un sistema." | "Perfecto. ¿Te permite pedir en inglés y coreano? ¿Te dice quién es tu cliente favorito? ¿Te envía un mensaje a los que no han vuelto? Si tu sistema hace eso, no necesitas esto. Si no... aquí está lo que te falta." |
| "No entiendo de apps." | "No necesitas entender. Nosotros configuramos todo. Tu menú, tus fotos, tus precios. En una semana estás listo. Tú solo necesitas recibir los pedidos. Como siempre, pero sin errores." |
| "¿Y si no funciona?" | "30 días gratis. Sin tarjeta. Si no ganas más dinero, no pagas. ¿Qué tienes que perder?" |
| "Déjame pensarlo." | "Claro. Solo una pregunta: ¿qué necesitas ver para decidir? ¿Una demo? ¿Hablar con otro restaurante que ya la usa? ¿Ver los números? Dime y lo arreglamos ahora." |
| "El Mundial es en un año." | "Exacto. Los restaurantes que empiezan en junio 2025 tendrán menú traducido, fotos profesionales, clientes capturados, y promociones listas. Los que empiezan en mayo 2026... tendrán una semana. ¿En qué grupo quieres estar?" |

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| Landing page conversion (quiz start → completion) | >60% |
| Quiz completion → demo booking | >25% |
| Demo → trial start | >50% |
| Trial → paid conversion | >40% |
| In-person pitch → trial start | >60% |
| Cost per lead (landing page) | <$200 MXN |
| Time to close (in-person) | <14 days |

---

## 10. Implementation Notes

### Landing Page Tech Stack
- Use existing React + Vite + Tailwind setup
- Add route `/monterrey-mundial-2026` (or `/promo`, `/worldcup`)
- Use Framer Motion for quiz transitions
- Integrate with existing PocketBase client
- Use react-calendly or cal.com embed for booking
- Use jspdf or @react-pdf/renderer for scorecard PDF

### Sales Deck Tech Stack
- Google Slides or Canva for design
- Export to PDF for tablet use
- QR code on last slide links to signup form

### Lead Integration
- Extend existing PocketBase schema (see Deliverable 3)
- Create admin view for lead management (can reuse existing AdminModule pattern)
- Add lead status pipeline view

---

## 11. Next Steps (Implementation Plan)

1. **Create `leads` collection in PocketBase** (schema defined above)
2. **Build landing page shell** (hero + quiz container)
3. **Implement 8-question quiz** with progress bar and animations
4. **Build scoring engine** (calculate 5-category score + readiness score)
5. **Build results page** (score display + action plan + CTAs)
6. **Integrate lead capture** (form → PocketBase + Calendly embed)
7. **Build sales deck** (12 slides in Google Slides/Canva)
8. **Write printed sales script** (1-page laminated card)
9. **Add analytics tracking** (question drop-off, CTA clicks)
10. **Test end-to-end** (quiz → score → booking → lead created)

---

**Status:** Design complete, awaiting approval.
