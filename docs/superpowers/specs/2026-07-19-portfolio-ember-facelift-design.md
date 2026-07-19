# Portfolio "Ember" Facelift — Design Spec

**Date:** 2026-07-19
**Site:** https://oluwatemmy.netlify.app (this repo, deployed on Netlify)
**Approach:** Facelift — keep the existing template skeleton (4 swap-sections + jQuery nav), replace the visual skin, rewrite content, fix all known bugs. No framework rewrite.

## Goals

1. Replace the flat yellow/black template look with the approved **Ember** theme.
2. Refresh all content to match the 2026 CV (experience ended at 2024 on the live site).
3. Rebuild the portfolio section as a data-driven, easily extendable project grid.
4. Fix every known bug (fonts, JS crash, exposed SMTP token, typos, SEO, mobile hero).

## 1. Ember Theme (site-wide)

| Token | Value |
|---|---|
| Page background | `#1c1917` (warm charcoal) |
| Hero background | subtle gradient `#1c1917 → #292018` (135–160deg) |
| Card surface | `#231f1c` |
| Card border | `#35302c` |
| Primary text | `#fafaf9` |
| Secondary text | `#a8a29e` |
| Muted text | `#78716c` |
| Accent gradient | `#fbbf24 → #f97316` (amber → orange, 90deg) |
| Accent solid (icons, kickers, links) | `#fbbf24` |
| Pill text | `#fcd34d`, pill border `#57534e` |

- Gradient is used for: logo/name accent, section-title highlight word, primary buttons, headline sub-titles. Gradient text via `background-clip: text`.
- Primary button: gradient background, `#1c1917` text, 8px radius. Secondary button: 1px `#44403c` border, `#e7e5e4` text.
- Typography: **Poppins** (headings) + **Open Sans** (body), loaded from Google Fonts with correct URLs (current ones are broken relative paths).
- Implementation: new `css/skins/ember.css` replaces `css/skins/yellow.css` as the single active skin. Delete the 9 other demo skins, `styleswitcher.css`, and `js/styleswitcher.js`.

## 2. Home (hero)

- Keep current photo treatment (large image left on desktop; on mobile the photo MUST be visible — current site hides it below 576px).
- Content: kicker "BACKEND DEVELOPER" (amber, letterspaced) → name heading → gradient subtitle "Python · Django · APIs that scale" → one-liner mentioning Authease on PyPI and production services → buttons **View Projects** (primary) and **Download CV** (secondary).
- Download CV points at the existing PDF; folder renamed `assests/` → `assets/`.

## 3. About

### Bio
Rewritten, backend-focused: production experience with FastAPI, Celery, Redis, Django; creator of Authease (PyPI). Keep it to 2 short paragraphs.

### Personal info block
Unchanged fields (name, nationality, freelance availability, Lagos, phone, email), fix "langages" → "languages".

### Experience (replaces the outdated 2022–2024 timeline)
1. **Backend Developer — SterneHero (Germany), Remote** · Jun 2025 – Present
   - Distributed review-removal automation system: FastAPI, PostgreSQL, Celery, Redis; async task orchestration, retry logic, failure recovery in production.
   - Integrated Google Business Profile APIs (Account Management, Business Information, Reviews) with OAuth lifecycle management and quota-aware error handling.
   - Gmail automation & status-classification system; hardened production infra (Redis SSL, Celery stability, Heroku → Hetzner migration architecture).
2. **Backend Developer — Turbham Technologies (Startup Division – Zagaride), Remote** · Oct 2025 – Jan 2026
   - Production ride-hailing API (60+ endpoints) with Node.js, TypeScript, PostgreSQL; passenger/driver/admin lifecycles.
   - Real-time matching engine (WebSockets, Polyline tracking); JWT sessions, RBAC, rate limiting; ~30% latency reduction via Redis caching and Prisma query optimisation.
3. **Python Developer — Yetti Technology (Nigeria), Remote** · Sep 2022 – Sep 2024
   - Backend services with Django; PostgreSQL schema design and query tuning with SQLAlchemy.
   - Established code reviews, Pytest-based testing, CI/CD (GitHub Actions, Docker).

(Overlap between SterneHero and Turbham is intentional — both remote roles.)

### Education
Unchanged: LASU BSc CS (2024 – Present), Side Hustle Backend (2023), AltSchool (2022 – 2023), SSCE.

### Skills (replaces circular icon grid)
Categorized cards with pill tags (approved mockup "A"), 6 cards in a responsive grid:

| Category | Pills |
|---|---|
| Backend Development | Python, Django, FastAPI, Flask, Node.js, Celery |
| Databases | PostgreSQL, Redis, MySQL, SQLAlchemy, Prisma |
| API Development | RESTful APIs, WebSockets, Swagger/OpenAPI, Google APIs |
| Security & Auth | JWT, OAuth, RBAC, Rate Limiting, Session Management |
| DevOps & Tools | Docker, GitHub Actions, Git, Pytest, Heroku/Hetzner |
| Frontend Knowledge | JavaScript, TypeScript, React, HTML/CSS |

Each card: icon chip (amber on `#2c2320`), title, wrap of pills.

## 4. Portfolio (data-driven, extendable)

### Data model
New file `js/projects.js` — a plain array of objects; cards are rendered from it. Adding a future project = adding one object, no HTML edits.

```js
const projects = [
  {
    name: "Authease",
    desc: "Open-source Django package: plug-and-play authentication with OAuth, JWT, RBAC.",
    stack: ["Python", "Django", "OAuth", "JWT"],
    github: "https://github.com/Oluwatemmy/authease",
    live: "https://pypi.org/project/authease/",   // null → no Live button rendered
    category: "package",                            // package | api | app | tool
    featured: true                                   // shows ★ PyPI/featured badge
  },
  // ...
];
```

### Initial project list (12)

| Project | Category | Live link | Notes |
|---|---|---|---|
| Authease | package | PyPI | featured badge |
| GigFlow API | api | — | Upwork-style freelancing platform REST API (Django) |
| YouTube Downloader Pro | tool | — | FastAPI + asyncio, 360p–4K, concurrent downloads |
| Student Management API | api | — | flask_restx, 3★ |
| LinkEase | app | — | URL shortener + QR (Flask) |
| Invoice Generator | app | — | Flask, printable invoices |
| Authease Blog Demo | app | — | Django blog showcasing Authease |
| Authease API | api | — | REST API docs/demo for the package |
| Pizza Delivery API | api | — | flask restx |
| Stores REST API | api | — | 2★ |
| Blog API | api | — | Django/Python |
| BaseScan Scraper | tool | — | Python scraper |

- Filter tabs above the grid: **All / Packages / REST APIs / Web Apps / Tools** (simple JS show/hide on `category`; no Masonry/gallery plugins).
- Card layout: category label, name, 1–2 line description, stack pills, footer links (GitHub always; Live only when non-null).
- "Live" buttons are never rendered for missing links (no dead buttons). Future deployments (Render/Railway/Fly.io free tiers) just fill in `live`.
- Removes: old screenshot grid, `cbpGridGallery.js`, `masonry.pkgd.min.js`, `imagesloaded.pkgd.min.js`, `jquery.hoverdir.js` and their init code (fixes the console crash).
- Old beginner projects (Tic-Tac-Toe, Blackjack, Phonie, Notes API, Buzz-Bite) are dropped from the site.

## 5. Contact

- Replace SmtpJS with **Netlify Forms**:
  - `<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">` + hidden form-name input; success/error message inline (fetch-based AJAX submit so the page doesn't navigate away).
  - Remove the SmtpJS `<script>` and the inline `sendEmail()` (the exposed SecureToken goes away entirely).
  - Post-deploy manual step (user): Netlify dashboard → Forms → enable email notification to oluwaseyitemitope456@gmail.com.
- Rationale recorded: static sites cannot hide secrets in env files; Netlify Forms handles submissions server-side on the existing host, free tier 100/month.
- Left column (mail/phone/socials) unchanged, restyled to Ember.

## 6. Bug fixes & housekeeping

1. Google Fonts `<link>`s: replace broken `../../css?family=...` with proper `https://fonts.googleapis.com/...` URLs (fixes MIME console errors and missing fonts).
2. Remove cbpGridGallery init in `custom.js` (fixes `Cannot read properties of null` crash).
3. Duplicate ID: Download CV button loses `id="link-portfolio"`.
4. Rename `assests/` → `assets/`; update CV href.
5. Typos: "langages" → "languages", alt "Portolio" → "Portfolio".
6. SEO/meta: `<meta name="description">`, Open Graph (title, description, image, url), Twitter card, correct favicon `type`.
7. Mobile: hero photo visible at all widths; verify all 4 sections at 390px.
8. Delete dead assets: unused skin CSS files, styleswitcher JS/CSS, gallery/masonry JS, unused project screenshots.

## Out of scope

- Framework rewrite (React/Astro/etc.), blog, dark/light toggle, deploying the other projects, updating SterneHero bullets beyond the current CV (user will supply later).

## Files touched (summary)

- `index.html` — all four sections' content, head links, meta tags, form
- `css/skins/ember.css` — new (replaces yellow.css as active skin)
- `css/style.css` — targeted overrides for cards/pills/buttons where structural
- `js/projects.js` — new (project data + card render + filters)
- `js/custom.js` — remove gallery init, add form AJAX handler
- Deleted: 9 skin CSS files, styleswitcher CSS/JS, cbpGridGallery.js, masonry, imagesloaded, hoverdir, old project images
- Renamed: `assests/` → `assets/`

## Verification

- No console errors on load (currently 3).
- Lighthouse: fonts load, no 404s in Network tab.
- All 4 sections visually correct at 1280px and 390px widths.
- Filter tabs show/hide correct cards; every GitHub link resolves; only Authease shows a Live button.
- Netlify deploy preview: form submission appears in Netlify Forms dashboard.
