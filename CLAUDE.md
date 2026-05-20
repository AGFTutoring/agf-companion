# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # ESLint check
```

No test suite exists.

## Environment

Copy `.env.example` to `.env.local` and fill in:
- `ANTHROPIC_API_KEY` — Claude API access
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — payments
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — client-side Stripe

## Architecture

**Next.js 15 App Router** app. All UI lives in a single large component (`app/page.js`, ~4200 lines). API routes are in `app/api/`.

### `app/page.js` — monolithic client component

The entire frontend is one `Home()` function. Key sections:

- **Color palette**: constant `C` at the top of the file defines all brand colors (`C.green`, `C.charcoal`, etc.). Use these instead of raw hex values.
- **`UNITS` array** (~line 1101): catalog of every subject/exam-board pairing. Each entry has `id`, `name`, `code`, `icon`, `colour`, `prompt[]` (example questions), `welcome`, and `system` (the full teaching prompt injected into every chat). The system prompts embed ~2000–3000 lines of teaching notes per subject.
- **`PAST_PAPERS` object** (~line 40): question bank keyed by unit ID. Each question has `source`, `question`, `options[]`, `correctLabel`, `topic`, `difficulty`, `explanations{}`, `hint`.
- **`BOARD_CONTEXT` object**: system prompts for standalone exams (SAT, ACT, GMAT, AP subjects, GCSE, IB, etc.) that don't follow the UNITS structure.
- **State**: all in hooks; no external state library. Free-tier usage persisted to `localStorage` (`agf_quizzes_used`, `agf_daily_msgs`, `agf_subscribed`, `agf_sub_email`).
- **Three-screen flow**: subject picker → exam board picker → chat/quiz interface.

### API routes

| Route | Purpose |
|---|---|
| `app/api/chat/route.js` | Proxies to Anthropic `claude-sonnet-4-20250514`. Routes between `ask` mode (chat/hints/notes) and `quiz` mode (structured JSON question generation). |
| `app/api/checkout/route.js` | Creates a Stripe subscription checkout session. |
| `app/api/webhook/route.js` | Handles Stripe events: `checkout.session.completed`, `customer.subscription.deleted`. |
| `app/api/verify/route.js` | Checks if an email address has an active Stripe subscription. |

### Styling

Inline CSS throughout — no CSS files, no Tailwind, no CSS-in-JS library. All brand colors come from the `C` palette object in `page.js`. Fonts: Cormorant Garamond (display), DM Sans (UI), JetBrains Mono (code).

### Custom diagram tags

The AI responses use custom bracket tags that the frontend renders into visual elements:

- `[SHAPE:bent:H₂O:104.5°]` — molecular geometry diagrams
- `[MECHANISM:...]` — reaction mechanism arrows
- `[DISPLAYED:...]` — displayed structural formulae
- `[EQUATION:...]` — chemical equations
- `[CONFIG:...]` — electron configuration notation

These are parsed and rendered client-side in `page.js`.

### Free tier limits

- 3 quizzes total (cumulative, `agf_quizzes_used`)
- 20 messages per day (resets at midnight, `agf_daily_msgs`)
- Subscription verified via `/api/verify` on mount; stored in `localStorage`

### Root-level `.js` utility scripts

Files like `enrich-all-subjects.js`, `add-notes-view.js`, `fix-picker-redesign.js` are one-off data migration/admin scripts, not part of the app runtime.
