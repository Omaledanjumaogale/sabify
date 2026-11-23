# Sabify

**Learn it. Play it. Own it.**

Sabify is a Nigeria-first, gamified and personalised learning universe for kids, youths and students. It combines structured NERDC-aligned lessons, seven playable learning games, a safe AI study buddy, mastery analytics and real dashboards for learners, teachers, parents and school operators.

Built with **SvelteKit 2**, **Svelte 5 runes**, **Three.js**, **Convex**, **Tailwind CSS 4** and **Cloudflare Pages**.

---

## Why Sabify

Most Nigerian edtech tools are either a video library or a quiz app. Sabify is a complete learning loop:

- **Learn** a short, story-driven lesson with worked examples and local context.
- **Practise** with mixed question types — choice, number, true/false, ordering, matching and short text.
- **Play** a game that trains the same skill, from a 3D maths starship to a Naira budgeting simulation.
- **Prove it** with quizzes, streaks, XP, coins, badges and mastery per skill.
- **Show it** to the people who care: weekly reports for parents, class analytics for teachers, revenue and content operations for admins.

The entire product is designed mobile-first, with simple English and a ₦5,000/month family plan.

---

## Feature map

### Learner experience
| Area | What is included |
| --- | --- |
| Dashboard | Greeting, continue-learning hero, XP/streak/accuracy/coins, weekly momentum, mastery rings, recommended lessons, quests, leaderboard, next badge, due assignment |
| Subjects | 8 subjects and 12 full courses with modules, lessons and question banks |
| Lesson player | Learning cards (read, tip, example, vocabulary, steps, reflect, did-you-know), notes, hints, quiz phase, results and XP |
| Games | Number Nebula (Three.js), Word Forge, Type Storm, Memory Match, Quiz Arena, Logic Lab, Money Quest |
| Daily quiz | A generated daily set plus six themed quiz packs |
| AI tutor | Rule-based, offline-safe study buddy with maths solving, topic explanations and safety filters |
| Motivation | XP, levels, ranks, coins, daily/weekly quests, reward shop, streak calendar, badges, leaderboard |
| Library | Saved resources, revision sheets and study guides |
| Profile & settings | Avatar, interests, learning preferences, sound, accessibility, heatmap, badge cabinet |
| Subscription | ₦5,000/month family plan, annual option, Paystack/transfer/USSD demo checkout |

### Teacher experience
Dashboard with engagement and at-risk learners, student directory and profiles, assignment creation/publishing/grading, a content studio that turns a topic into an editable draft, class analytics, and school settings/integrations.

### Parent experience
Family dashboard for multiple children, weekly plain-English reports, screen-time and XP goals, teacher notes, progress alerts, and billing with invoices.

### Admin experience
Platform overview (MRR, learners, teachers, schools, churn), user and organisation management, content catalogue and moderation queue, revenue, invoices, payouts and unit economics.

---

## Stack

- **SvelteKit 2 + Svelte 5** — file-based routing, runes, SSR disabled for a static SPA.
- **Tailwind CSS 4** — custom `@theme` design tokens, not a component library.
- **Three.js** — the landing hero scene and Number Nebula game, with pointer parallax, procedural crystals and cleanup on unmount.
- **Convex** — schema and server functions for users, content, progress, quizzes, games, quests, assignments, subscriptions, notifications and analytics.
- **Cloudflare Pages** — static build via `@sveltejs/adapter-static`, SPA fallback, `_redirects`, `_headers`, `wrangler.toml`.
- **Custom SVG components** — mascot, logo, avatars and charts (bar, line, donut, heatmap, progress ring) with no chart dependency.
- **Web Audio + Speech APIs** — game sound effects, tutor text-to-speech and optional speech input.

---

## Run locally

Requirements: Node 20+ (tested on Node 26), npm 10+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

The app opens in **demo mode** with a fully populated learner account (Ada Okafor), so every screen is explorable without a backend. Session and progress are stored in `localStorage` under `sabify.session.v1` and `sabify.progress.v1`.

Useful commands:

```bash
npm run build       # production build into build/
npm run preview     # preview the production build
npm run check       # svelte-check (0 errors expected)
npm run convex:dev  # start the Convex dev deployment
```

### Demo roles

The login page and the role switcher in the sidebar let you explore:

- **Learner** — `/app`
- **Teacher** — `/teacher`
- **Parent** — `/parent`
- **Admin** — `/admin`

The demo account is Ada Okafor, Primary 5, 12-day streak, 5,717 XP. Clearing site data resets the demo.

---

## Convex backend

The production data model lives in [`convex/`](./convex). It is intentionally separate from the browser demo adapter so the product works offline and on a static host.

```
convex/
├── schema.ts          # 19 tables + indexes
├── users.ts           # identity, profile, plan
├── content.ts         # subjects, courses, lessons, search, daily quiz
├── progress.ts        # XP, streak, mastery, quizzes, games, quests, leaderboard
├── assignments.ts     # create, publish, submit, grade
├── subscriptions.ts   # checkout, Paystack confirmation, invoices, cancel
├── analytics.ts       # teacher, parent and admin aggregates
└── seed.ts            # full catalogue + demo school/class/users
```

### Connect a deployment

```bash
npx convex dev
npx convex run seed:run
```

`npx convex dev` creates `.env.local` with `CONVEX_DEPLOYMENT` and `PUBLIC_CONVEX_URL`. Copy the values into `.env` (see `.env.example`) and wire the client where you want live sync.

The static demo stores progress locally; the Convex functions are ready for the server-backed version, including payment webhooks (`subscriptions.confirmPayment`) and notification creation.

> Security: `confirmPayment` is intended to be called only from a verified Paystack webhook (check the `x-paystack-signature` header with `PAYSTACK_SECRET_KEY`). Do not expose it directly to the browser.

---

## Cloudflare Pages

The project uses `@sveltejs/adapter-static` with an `index.html` fallback, which avoids platform-specific workerd binaries and deploys cleanly as an SPA.

### Option A — Git integration

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a project from the repo.
3. Build command: `npm run build`
4. Build output directory: `build`
5. Node version: 20 or newer.

### Option B — Wrangler

```bash
npm run build
npx wrangler pages deploy build --project-name sabify
```

Included Cloudflare files:

- `static/_redirects` — `/* /index.html 200`
- `static/_headers` — security headers and immutable asset caching
- `wrangler.toml` — `pages_build_output_dir = "./build"`

---

## Design system

Tokens and primitives live in `src/app.css`:

- **Palette** — forest, moss, emerald, mint, lime, lemon, gold, coral, sky, grape, cream, sand, cloud, slate.
- **Type** — Fredoka Variable for display, Nunito Variable for body.
- **Components** — `.btn` (primary, ghost, lime, white, danger), `.card`, `.pill`, `.chip`, `.input`, `.label`, `.progress-track/.progress-fill`, `.tint-*`, `.mesh-hero`, `.grain`.
- **Motion** — entrance, float, pop, shimmer and reduced-motion fallbacks.
- **Charts** — hand-built SVG components with accessible labels and no runtime chart library.

---

## Project structure

```
src/
├── app.css                  # Tailwind 4 theme + design system
├── app.html                 # meta, PWA manifest, OG tags
├── lib/
│   ├── components/          # 30+ UI, chart, shell and game components
│   ├── data/                # types, curriculum, games, demo seed
│   ├── engine/              # sound, rich text, AI tutor rules
│   ├── stores/              # session, progress, toast
│   └── utils.ts             # Naira formatting, confetti, helpers
└── routes/
    ├── +page.svelte         # marketing landing page
    ├── app/                 # learner experience
    ├── teacher/             # teacher workspace
    ├── parent/              # family portal
    ├── admin/               # operations console
    ├── login, signup, onboarding, pricing
    └── +error.svelte        # friendly 404/error page
convex/                      # schema + server functions + seed
static/                      # PWA, icons, SEO, Cloudflare config
```

---

## Curriculum and content

- **8 subjects**: Mathematics, English, Science, Coding, Digital Skills, Money & Enterprise, Civics & Naija History, Arts & Creativity.
- **12 courses**, each with modules, lessons, learning cards and mixed question types.
- **6 curriculum frameworks**: NERDC, Common Core, UK National, Cambridge, IB and WAEC.
- Every lesson includes an objective, estimated minutes, XP, difficulty, explanations and hints.
- Nigerian context is deliberate: market maths, suya fractions, Naira budgeting, national symbols and local stories.

The content is demo-scale but production-shaped: add a course in `src/lib/data/curriculum.ts` (or the Convex catalogue) and it appears across subject pages, search, quizzes and dashboards.

---

## Pricing

| Plan | Price | Who it is for |
| --- | --- | --- |
| Explorer | Free | Try lessons and games with limits |
| Family | **₦5,000 / month** | One learner, unlimited lessons, games and reports |
| Family Plus | ₦12,000 / month | Up to 4 learners, sibling leaderboards, advanced controls |
| School | ₦3,500 / learner / month | Class management, teacher tools, school analytics |

Annual Family is ₦50,000 (two months free). Prices are shown in Naira everywhere in the product.

---

## Safety and accessibility

- Rule-based tutor with age-appropriate language, no external model calls in demo mode, and filters for personal and unsafe requests.
- No stranger chat; parent and teacher visibility is built into the product model.
- Screen-time limits and daily XP goals for guardians.
- Semantic landmarks, focus styles, reduced-motion support, responsive type and 44px touch targets.
- `prefers-reduced-motion` disables float/shimmer and shortens transitions.

---

## Product research inputs

The experience was informed by a study of gamified learning products and open-source implementations, including YuviLab, Squad for Kids, EduJoy, Learncha, the Interactive Learning Knowledge Atlas, and repositories such as thinkrank, Kidlearn, GoGamify, sagefy and LearnMath. Sabify does not copy their code or branding; it harmonises the strongest patterns — progression, play, mastery, reporting and local relevance — into one coherent product.

---

## Status

The frontend is complete and buildable; the Convex backend is implemented and ready for a deployment. The demo intentionally runs on local storage so the full product can be reviewed on a static host without secrets.

Built with care in Nigeria. 🇳🇬
