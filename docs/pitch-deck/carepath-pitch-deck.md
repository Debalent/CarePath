---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
style: |
  section {
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
    color: #0f172a;
  }
  h1 {
    color: #0369a1;
  }
  h2 {
    color: #0f766e;
  }
  section.lead {
    background: linear-gradient(135deg, #0369a1, #0f766e);
    color: #ffffff;
  }
  section.lead h1, section.lead h2, section.lead p {
    color: #ffffff;
  }
  .badge {
    display: inline-block;
    background: #e0f2fe;
    color: #075985;
    border-radius: 999px;
    padding: 2px 12px;
    font-size: 0.7em;
    font-weight: 600;
  }
---

<!-- _class: lead -->

![w:160](../../carepath-ui/public/carepath-logo.png)

# CarePath
## Reliable Rides to Care

Demond Balentine (Overall Dev — Frontend, Backend & Concept)
Remington Neustadter (Backend Developer)
Michelle Berthiaume (Design & Frontend)

Atlas School Capstone · Builders+Backers Mobility Cohort · Demo Day Aug 13, 2026

---

## The Problem

Patients in rural and low-income areas miss critical medical appointments — dialysis, oncology, cardiology, post-surgical follow-ups — not by choice, but because they have no reliable way to get there.

- Medicaid transport cancels rides with no notice
- Volunteer drivers have no visibility into patient needs
- Coordinators manage everything manually by phone and text
- When a ride falls through, there is **no organized fallback**

**Result:** no-shows, health deterioration, avoidable ER visits.

---

## Validated by Real Conversations

<span class="badge">15 stakeholder interviews</span> <span class="badge">5 user types</span> <span class="badge">13 strong pain signals</span>

> "There's no backup when transport fails — when it falls through, that's it."

The single highest-impact validated gap: **no fallback path when a ride fails.**

---

## The Solution

CarePath is a **transportation coordination platform** — not a ride-hailing app.

It connects patients, volunteer/NEMT drivers, coordinators, and institutional partners in one shared system:

**Request → Match → Confirm → Complete → Survey**

...with automatic fallback escalation the moment a ride is at risk.

---

## Who We Serve

| Role | Need |
|---|---|
| **Patients** | Reliable rides to essential medical appointments |
| **Volunteer / NEMT Drivers** | A real coordination tool instead of ad-hoc texts |
| **Coordinators** | One dashboard instead of manual phone/paper juggling |
| **Institutional Partners** | A way to fund and track ride credits for their community |
| **Caregivers / Advocates** | Ability to arrange rides on a patient's behalf |

---

## How It Works

1. Patient submits a ride request with accessibility needs (wheelchair, oxygen, stretcher)
2. Coordinator matches an available, qualified driver
3. Ride moves through **Pending → Matched → Confirmed → In Progress → Completed**
4. If a ride can't be filled, it's flagged **Fallback Needed** — backup drivers are alerted instantly
5. Patient completes a post-ride survey to close the loop

---

## Key Features

- Accessibility-first driver matching — a hard filter, not a hint
- Automatic fallback escalation when a ride is at risk
- SMS reminders at 48hr / 24hr / 2hr before pickup
- Full communication log for every ride
- Post-ride NPS survey and outcome tracking
- Coordinator dashboard with live ride stats
- Institutional partner ride-credit system
- Mobile-first design, built for how patients actually access it

---

## What Makes CarePath Different

- **Location-agnostic** — never uses mileage as a decision factor
- Fallback and accessibility are **core features**, not afterthoughts
- Focused on proving **one coordination workflow** end-to-end, not a broad unfocused marketplace

---

## Under the Hood

| Layer | Technology |
|---|---|
| API | Node.js + TypeScript + Express |
| Database | PostgreSQL + Prisma ORM |
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Auth | JWT, role-based access |
| Messaging | Twilio SMS |
| Hosting | AWS Amplify (UI) + Railway (API) |

---

## Demo Day Deliverable

A live, deployed web app demonstrating the full ride lifecycle end-to-end:

**Patient intake → Coordinator matching → Fallback escalation → Driver completion → Post-ride survey**

Using real authentication and a seeded demo dataset — accessible live on a mobile device.

---

## Impact Potential

Fewer missed appointments → fewer avoidable ER visits → better outcomes for patients managing dialysis, oncology, and cardiology care.

Starting in **Arkansas**, in rural and low-income communities where public transit is limited and Medicaid transportation is unreliable.

---

<!-- _class: lead -->

# CarePath

## Because a missed ride shouldn't mean missed care.

github.com/Debalent/CarePath
