# Portfolio "Ember" Facelift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the existing 4-section portfolio template to the approved Ember theme, refresh all content to the 2026 CV, replace the screenshot portfolio with a data-driven filterable project grid, and fix all known bugs (fonts, JS crash, exposed SMTP token, typos, SEO, mobile hero).

**Architecture:** Keep the template skeleton (jQuery page-swap nav in `menu.js`/`main.js`). Recolor via a new skin `css/skins/ember.css` + direct hex remap inside `css/style.css`; all NEW components (skill cards, pills, project cards, filters) live in `css/ember-components.css`. Project data lives in `js/projects.js` (array of objects → rendered cards), so future projects are added by appending one object.

**Tech Stack:** Static HTML/CSS/JS, jQuery 3.7 (existing), Bootstrap grid (existing), Netlify Forms, Google Fonts.

**Spec:** `docs/superpowers/specs/2026-07-19-portfolio-ember-facelift-design.md`

**⚠️ Commits:** The user commits manually. NEVER run `git add`/`git commit`/`git push`. Each task ends with a **Checkpoint** step: stop, summarize what changed, and let the user review/commit.

**Verification servers:** Test locally with `python -m http.server 8080` from the repo root, then browse `http://localhost:8080`. Playwright MCP tools are available for automated checks (navigate, screenshot, console_messages).

---

### Task 1: Head cleanup — fonts, SEO meta, stylesheet links

**Files:**
- Modify: `index.html:1-33` (the `<head>`)

- [ ] **Step 1: Replace the entire `<head>` block**

Replace `index.html` lines 3–33 (`<head>` ... `</head>`) with:

```html
  <head>
    <meta charset="utf-8">
    <title>Oluwaseyi Ajayi — Backend Developer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Oluwaseyi Ajayi is a backend developer (Python, Django, FastAPI) building production APIs, auth systems, and scalable services. Creator of Authease on PyPI.">
    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://oluwatemmy.netlify.app/">
    <meta property="og:title" content="Oluwaseyi Ajayi — Backend Developer">
    <meta property="og:description" content="Python · Django · FastAPI. Production APIs, auth systems, and scalable services. Creator of Authease on PyPI.">
    <meta property="og:image" content="https://oluwatemmy.netlify.app/img/AOTEM.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Oluwaseyi Ajayi — Backend Developer">
    <meta name="twitter:description" content="Python · Django · FastAPI. Production APIs, auth systems, and scalable services. Creator of Authease on PyPI.">
    <meta name="twitter:image" content="https://oluwatemmy.netlify.app/img/AOTEM.png">
    <link rel="shortcut icon" type="image/png" href="./img/mylogo.png">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <!-- Template CSS Files -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/component.css" rel="stylesheet">
    <link href="css/circle.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <!-- Ember skin + components -->
    <link href="css/skins/ember.css" rel="stylesheet">
    <link href="css/ember-components.css" rel="stylesheet">
    <!-- Modernizr JS File -->
    <script src="js/modernizr.min.js"></script>
  </head>
```

This removes: the two broken `../../css?family=...` links, `css/skins/yellow.css`, all 10 `alternate stylesheet` skin links, and `css/styleswitcher.css`. It adds: correct Google Fonts URLs, SEO/OG/Twitter meta, and the two new stylesheets (created in Tasks 2–3 — the site will 404 on them until then; that's expected mid-work).

Security note: Subresource Integrity (SRI) hashes are deliberately NOT added to the Google Fonts `<link>`s — Google serves different CSS per user-agent, so a pinned hash would break font loading. After Task 9 removes SmtpJS, the site loads **no external scripts at all**; fonts are the only third-party resource.

- [ ] **Step 2: Remove the styleswitcher script tag**

In the script block at the bottom of `index.html` (currently lines 698–709), delete this line:

```html
    <script src="js/styleswitcher.js"></script>
```

- [ ] **Step 3: Checkpoint** — user reviews/commits. Site still renders (yellow skin gone; ember.css missing yet — proceed straight to Task 2).

---

### Task 2: Create the Ember skin

**Files:**
- Create: `css/skins/ember.css`
- Modify: `css/style.css` (hex remap only)
- Modify: `js/menu.js:14`

- [ ] **Step 1: Create `css/skins/ember.css`**

Adapted from `css/skins/yellow.css` — same selector groups, Ember values, plus gradient treatments:

```css
/* =================================================================== */
/* EMBER  amber #fbbf24 → orange #f97316 on warm charcoal #1c1917
====================================================================== */

.home h1,
.about .box-stats h3,
.title-section h2 span,
.mobile-nav-element.active,
body.light #menu li.active a,
.contact .custom-span-contact i,
.portfolio .grid figure:hover figcaption {
	color: #fbbf24;
}
.home .home-details h1:before,
.about .resume-box .icon,
.contact ul.social li a:hover,
body.light .contact ul.social li a:hover,
.preloader .loader,
.portfolio .grid li figure div,
.header ul.icon-menu li.icon-box.active, .header ul.icon-menu li.icon-box:hover,
body.light .header ul.icon-menu li.icon-box.active, body.light .header ul.icon-menu li.icon-box:hover,
.btn,
.header .icon-box h2,
.home .color-block,
.title-section hr,
.line:before,
.button:before,
.button-icon {
	background: linear-gradient(90deg, #fbbf24, #f97316);
}
.revealer > div:nth-child(2) {
	background: linear-gradient(90deg, #fbbf24, #f97316) !important;
}
.contact .contactform input[type=text]:focus,
.contact .contactform input[type=email]:focus,
.contact .contactform textarea:focus,
.button {
	border: 1px solid #fbbf24;
}
.pie, .c100 .bar {
	border: 0.08em solid #fbbf24;
}
```

- [ ] **Step 2: Remap dark surfaces in `css/style.css`**

Run from the repo root (Git Bash):

```bash
sed -i 's/#111\b/#1c1917/g; s/#252525/#231f1c/g; s/#2b2a2a/#231f1c/g; s/#222\b/#292524/g' css/style.css
```

Then verify: `grep -c "1c1917" css/style.css` — expected: 3 or more matches; `grep -c "#252525" css/style.css` — expected: 0.

- [ ] **Step 3: Update revealer animation colors in `js/menu.js`**

In `js/menu.js` line 14, change:

```js
         bgcolor: ['#eee', '#ffb400', '#eee'],
```

to:

```js
         bgcolor: ['#231f1c', '#f97316', '#231f1c'],
```

- [ ] **Step 4: Verify in browser**

Run: `python -m http.server 8080`, open `http://localhost:8080`. Expected: dark warm charcoal background, amber/orange gradient accents on nav hover, section titles, buttons. No yellow `#ffb400` anywhere.

- [ ] **Step 5: Checkpoint** — user reviews/commits.

---

### Task 3: Create `css/ember-components.css`

**Files:**
- Create: `css/ember-components.css`

- [ ] **Step 1: Create the file with all new component styles**

```css
/* =================================================================== */
/* EMBER COMPONENTS — hero, skill cards, pills, project cards, filters
====================================================================== */

/* ---- shared tokens ---- */
:root {
  --ember-bg: #1c1917;
  --ember-surface: #231f1c;
  --ember-border: #35302c;
  --ember-text: #fafaf9;
  --ember-text-2: #a8a29e;
  --ember-text-3: #78716c;
  --ember-amber: #fbbf24;
  --ember-pill: #fcd34d;
  --ember-gradient: linear-gradient(90deg, #fbbf24, #f97316);
}

.gradient-text {
  background: var(--ember-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---- hero ---- */
.home .hero-kicker {
  color: var(--ember-amber);
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 10px;
}
.home .hero-tagline {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 22px;
  margin: 6px 0 0;
}
/* hero photo visible on phones (template hid it below 576px) */
@media (max-width: 575.98px) {
  .home .main-img-mobile.d-none.d-sm-block {
    display: block !important;
    max-width: 220px;
    margin: 0 auto 24px;
    border-radius: 20px;
    border: 2px solid var(--ember-amber);
  }
}

/* ---- skills: categorized cards with pills ---- */
.skill-card {
  background: var(--ember-surface);
  border: 1px solid var(--ember-border);
  border-radius: 12px;
  padding: 24px;
  height: 100%;
  text-align: left;
}
.skill-card .skill-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #2c2320;
  color: var(--ember-amber);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 14px;
}
.skill-card h5 {
  color: var(--ember-text);
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}
.skill-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.skill-pills li {
  border: 1px solid #57534e;
  color: var(--ember-pill);
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 14px;
}

/* ---- portfolio: filters ---- */
.portfolio-filters {
  margin: 0 0 30px;
  padding: 0;
  list-style: none;
}
.portfolio-filters li {
  display: inline-block;
  margin: 0 6px 10px;
}
.portfolio-filters button {
  background: transparent;
  border: 1px solid var(--ember-border);
  color: var(--ember-text-2);
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  padding: 7px 18px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.portfolio-filters button:hover {
  color: var(--ember-text);
  border-color: var(--ember-amber);
}
.portfolio-filters button.active {
  background: var(--ember-gradient);
  border-color: transparent;
  color: #1c1917;
  font-weight: 600;
}

/* ---- portfolio: project cards ---- */
.project-card {
  background: var(--ember-surface);
  border: 1px solid var(--ember-border);
  border-radius: 12px;
  padding: 22px;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--ember-amber);
}
.project-card .project-category {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ember-text-3);
  margin-bottom: 8px;
}
.project-card .project-category.featured {
  color: var(--ember-amber);
}
.project-card h4 {
  color: var(--ember-text);
  font-family: "Poppins", sans-serif;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
}
.project-card p {
  color: var(--ember-text-2);
  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 14px;
}
.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 0;
  margin: 0 0 16px;
  list-style: none;
}
.project-stack li {
  background: #2c2723;
  color: var(--ember-pill);
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
}
.project-links a {
  color: var(--ember-text);
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
  margin-right: 16px;
  text-decoration: none;
}
.project-links a:hover {
  color: var(--ember-amber);
}
.project-links a i {
  margin-right: 5px;
  color: var(--ember-amber);
}
```

- [ ] **Step 2: Verify no 404s**

Reload `http://localhost:8080` — Network tab (or Playwright `browser_network_requests`): `ember.css` and `ember-components.css` both return 200.

- [ ] **Step 3: Checkpoint** — user reviews/commits.

---

### Task 4: Hero section + View Projects navigation

**Files:**
- Modify: `index.html:109-132` (home section)
- Modify: `js/menu.js:3` and `js/menu.js:131-167`

- [ ] **Step 1: Replace the home-details content**

In `index.html`, replace the inner `<div>` of `.home-details` (currently lines 117–126) with:

```html
                <div>
                  <img src="./img/AOTEM.png" class="img-fluid main-img-mobile d-none d-sm-block d-lg-none" style="object-fit: cover; object-position: top;" alt="Oluwaseyi Ajayi">
                  <span class="hero-kicker open-sans-font">Backend Developer</span>
                  <h1 class="text-uppercase poppins-font">I'm Oluwaseyi Ajayi</h1>
                  <p class="hero-tagline gradient-text poppins-font">Python · Django · APIs that scale</p>
                  <p class="open-sans-font">From <a class="gradient-text" href="https://pypi.org/project/authease/" target="_blank" rel="noopener">Authease</a> on PyPI to production services — I build the parts users never see but always rely on.</p>
                  <a id="link-projects" class="button">
                    <span class="button-text">View Projects</span>
                    <span class="button-icon fa fa-arrow-right"></span>
                  </a>
                  <a class="button" href="assets/Ajayi Oluwaseyi - Python Developer Resume.pdf" download="Oluwaseyi_Ajayi_Backend_Developer_Resume.pdf">
                    <span class="button-text">Download CV</span>
                    <span class="button-icon fa fa-download"></span>
                  </a>
                </div>
```

(The hero CV link uses `assets/` — the folder is renamed in Task 5; if executing this task first, the link 404s until Task 5 runs. That's fine.)

- [ ] **Step 2: Guard `link-about` and add the `link-projects` handler in `js/menu.js`**

The `#link-about` element no longer exists, but `js/menu.js:131` binds to it unconditionally and would throw. At line 3, after `var link_about = document.getElementById('link-about');`, add:

```js
var link_projects = document.getElementById('link-projects');
```

Wrap the entire existing `link_about.addEventListener('click', function () { ... });` block (lines 131–167) in a guard:

```js
   if (link_about) {
      link_about.addEventListener('click', function () {
         // ... existing body unchanged ...
      });
   }
```

Then after that guarded block, add:

```js
   if (link_projects) {
      link_projects.addEventListener('click', function () {
         indexPage = 2;
         reveal('top');
         var mobile_nav_elements = document.querySelectorAll(".mobile-nav-element");
         var desktop_nav_elements = document.querySelectorAll(".desktop-nav-element");
         setTimeout(function () {
            document.body.classList.remove('home-page');
            for (var i = 0; i < mobile_nav_elements.length; i++) {
               mobile_nav_elements[i].classList.remove('active');
            }
            for (var j = 0; j < desktop_nav_elements.length; j++) {
               desktop_nav_elements[j].classList.remove('active');
            }
            desktop_nav.querySelector('li:nth-child(3)').classList.add('active');
            mobile_nav.querySelector('li:nth-child(3)').classList.add('active');
         }, 500);
      });
   }
```

(The `link_about` handler's long animation-class if/else chain always falls through to `reveal('top')` on this site — the body has none of the `animation-*` classes — so the new handler calls `reveal('top')` directly.)

- [ ] **Step 3: Verify**

Reload site. Expected: hero shows kicker + name + gradient tagline + Authease line + two buttons. "View Projects" navigates to the Portfolio section and highlights the briefcase nav icon. "Download CV" downloads the PDF (after Task 5's folder rename). Console shows no errors from menu.js. At 390px width the photo is visible above the heading.

- [ ] **Step 4: Checkpoint** — user reviews/commits.

---

### Task 5: About — bio, info list, CV button, assets rename

**Files:**
- Rename: `assests/` → `assets/`
- Modify: `index.html:149-224` (personal info + boxes)

- [ ] **Step 1: Rename the folder**

```bash
mv assests assets
```

- [ ] **Step 2: Replace the bio paragraph**

Replace the `<p>` at `index.html:159-165` with:

```html
                    <p>
                      Hello, <b class="gradient-text">I'm Oluwaseyi Ajayi</b> — a backend developer specializing in Python. I build production systems with Django, FastAPI, Celery and Redis: distributed automation pipelines, real-time APIs, and authentication systems, including <b>Authease</b>, my open-source Django auth package published on PyPI.
                      <br>
                      I currently work remotely as a Backend Developer at SterneHero (Germany), where I design and harden asynchronous services that integrate Google Business Profile APIs at production scale. I care about clean architecture, testing, and systems that fail gracefully.
                    </p>
```

- [ ] **Step 3: Fix the info list and CV button**

In the right-hand `about-list` block (`index.html:195-220`):
- Change `<span class="title">langages :</span>` to `<span class="title">languages :</span>`
- Replace the Download CV anchor (lines 216–219) with (duplicate `id="link-portfolio"` removed, `assests` → `assets`):

```html
                      <a class="button" href="assets/Ajayi Oluwaseyi - Python Developer Resume.pdf" download="Oluwaseyi_Ajayi_Backend_Developer_Resume.pdf">
                        <span class="button-text">Download CV</span>
                        <span class="button-icon fa fa-download"></span>
                      </a>
```

- [ ] **Step 4: Verify**

Reload → About. Expected: new bio renders with gradient name; "languages :" spelled right; Download CV downloads the PDF (200, not 404).

- [ ] **Step 5: Checkpoint** — user reviews/commits.

---

### Task 6: Experience & Education timeline

**Files:**
- Modify: `index.html:314-396` (Experience & Education rows)

- [ ] **Step 1: Replace the experience column** (`index.html:319-359`, the first `resume-box`)

```html
                <div class="col-lg-6 m-15px-tb">
                  <div class="resume-box">
                    <ul>
                      <li>
                        <div class="icon">
                          <i class="fa fa-briefcase"></i>
                        </div>
                        <span class="time open-sans-font text-uppercase">Jun 2025 - Present</span>
                        <h5 class="poppins-font text-uppercase">Backend Developer <span class="place open-sans-font">SterneHero · Germany (Remote)</span>
                        </h5>
                        <p class="open-sans-font">Architected a distributed review-removal automation system with FastAPI, PostgreSQL, Celery and Redis — async task orchestration, retry logic, and failure recovery in production.</p>
                        <p class="open-sans-font">Integrated Google Business Profile APIs (Account Management, Business Information, Reviews) with OAuth lifecycle management and quota-aware error handling.</p>
                        <p class="open-sans-font">Hardened production infrastructure: Redis SSL and Celery broker stability, safe retries, and a deployment architecture for the Heroku → Hetzner migration.</p>
                      </li>
                      <li>
                        <div class="icon">
                          <i class="fa fa-briefcase"></i>
                        </div>
                        <span class="time open-sans-font text-uppercase">Oct 2025 - Jan 2026</span>
                        <h5 class="poppins-font text-uppercase">Backend Developer <span class="place open-sans-font">Turbham Technologies · Zagaride (Remote)</span>
                        </h5>
                        <p class="open-sans-font">Built a production ride-hailing API (60+ endpoints) with Node.js, TypeScript and PostgreSQL, plus a real-time driver–passenger matching engine using WebSockets and Polyline tracking.</p>
                        <p class="open-sans-font">Strengthened security with JWT sessions, RBAC and rate limiting; cut latency ~30% via Redis caching and Prisma query optimisation.</p>
                      </li>
                      <li>
                        <div class="icon">
                          <i class="fa fa-briefcase"></i>
                        </div>
                        <span class="time open-sans-font text-uppercase">Sep 2022 - Sep 2024</span>
                        <h5 class="poppins-font text-uppercase">Python Developer <span class="place open-sans-font">Yetti Technology · Nigeria (Remote)</span>
                        </h5>
                        <p class="open-sans-font">Led development of Django backend services; designed and tuned PostgreSQL schemas with SQLAlchemy (indexing, transactions, query tuning).</p>
                        <p class="open-sans-font">Established code reviews, Pytest-based testing, and CI/CD pipelines with GitHub Actions and Docker.</p>
                      </li>
                    </ul>
                  </div>
                </div>
```

- [ ] **Step 2: Add AltSchool to the education column**

AltSchool currently lives in the experience column (which Step 1 replaced), but the spec keeps it. In the education `resume-box` (`index.html:360-394`), insert this `<li>` between the Side Hustle entry and the SSCE entry:

```html
                      <li>
                        <div class="icon">
                          <i class="fa fa-graduation-cap"></i>
                        </div>
                        <span class="time open-sans-font text-uppercase">2022 - 2023</span>
                        <h5 class="poppins-font text-uppercase">Backend Engineering <span class="place open-sans-font">AltSchool Africa</span>
                        </h5>
                        <p class="open-sans-font">Built and integrated third-party APIs, contributed to open-source, and collaborated internationally with Git/GitHub workflows — earning certifications along the way.</p>
                      </li>
```

LASU (2024 – Present), Side Hustle (2023) and SSCE entries stay unchanged.

- [ ] **Step 3: Verify**

Reload → About → scroll to Experience & Education. Expected: SterneHero on top with "Jun 2025 - Present", then Turbham, then Yetti.

- [ ] **Step 4: Checkpoint** — user reviews/commits.

---

### Task 7: Skills — categorized pill cards

**Files:**
- Modify: `index.html:227-311` (the skills row)

- [ ] **Step 1: Replace the entire skills row** (from `<!-- Skills Starts -->` comment content: the `<div class="row">` at lines 227–311) with:

```html
              <div class="row">
                <div class="col-12">
                  <h3 class="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-left text-sm-center custom-title ft-wt-600">My Skills</h3>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="skill-card">
                    <div class="skill-icon"><i class="fa fa-cogs"></i></div>
                    <h5>Backend Development</h5>
                    <ul class="skill-pills">
                      <li>Python</li><li>Django</li><li>FastAPI</li><li>Flask</li><li>Node.js</li><li>Celery</li>
                    </ul>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="skill-card">
                    <div class="skill-icon"><i class="fa fa-database"></i></div>
                    <h5>Databases</h5>
                    <ul class="skill-pills">
                      <li>PostgreSQL</li><li>Redis</li><li>MySQL</li><li>SQLAlchemy</li><li>Prisma</li>
                    </ul>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="skill-card">
                    <div class="skill-icon"><i class="fa fa-plug"></i></div>
                    <h5>API Development</h5>
                    <ul class="skill-pills">
                      <li>RESTful APIs</li><li>WebSockets</li><li>Swagger/OpenAPI</li><li>Google APIs</li>
                    </ul>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="skill-card">
                    <div class="skill-icon"><i class="fa fa-lock"></i></div>
                    <h5>Security &amp; Auth</h5>
                    <ul class="skill-pills">
                      <li>JWT</li><li>OAuth</li><li>RBAC</li><li>Rate Limiting</li><li>Session Management</li>
                    </ul>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="skill-card">
                    <div class="skill-icon"><i class="fa fa-cloud"></i></div>
                    <h5>DevOps &amp; Tools</h5>
                    <ul class="skill-pills">
                      <li>Docker</li><li>GitHub Actions</li><li>Git</li><li>Pytest</li><li>Heroku / Hetzner</li>
                    </ul>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="skill-card">
                    <div class="skill-icon"><i class="fa fa-globe"></i></div>
                    <h5>Frontend Knowledge</h5>
                    <ul class="skill-pills">
                      <li>JavaScript</li><li>TypeScript</li><li>React</li><li>HTML/CSS</li>
                    </ul>
                  </div>
                </div>
              </div>
```

- [ ] **Step 2: Verify**

Reload → About. Expected: 6 skill cards, 3 per row on desktop, 1 per row at 390px, amber icon chips, pill tags wrapping.

- [ ] **Step 3: Checkpoint** — user reviews/commits.

---

### Task 8: Portfolio — data-driven project grid

**Files:**
- Create: `js/projects.js`
- Modify: `index.html:404-557` (portfolio section) and the bottom script block

- [ ] **Step 1: Replace the portfolio section's main content**

Replace everything between `<div class="main-content text-center">` and its closing `</div>` (currently `index.html:414-554`, the whole `#grid-gallery` block) with:

```html
          <div class="main-content text-center">
            <div class="container">
              <ul class="portfolio-filters">
                <li><button class="active" data-filter="all">All</button></li>
                <li><button data-filter="package">Packages</button></li>
                <li><button data-filter="api">REST APIs</button></li>
                <li><button data-filter="app">Web Apps</button></li>
                <li><button data-filter="tool">Tools</button></li>
              </ul>
              <div class="row" id="projects-grid"></div>
            </div>
          </div>
```

- [ ] **Step 2: Create `js/projects.js`**

```js
/* ===================================================================
   PROJECT DATA — to add a project, append an object to this array.
   category: "package" | "api" | "app" | "tool"
   live: null → no Live button is rendered
==================================================================== */
var PROJECTS = [
  {
    name: "Authease",
    desc: "Open-source Django package offering plug-and-play authentication with OAuth, JWT, RBAC and simple login flows. Published on PyPI.",
    stack: ["Python", "Django", "OAuth", "JWT"],
    github: "https://github.com/Oluwatemmy/authease",
    live: "https://pypi.org/project/authease/",
    category: "package",
    featured: true
  },
  {
    name: "GigFlow API",
    desc: "Upwork-style freelancing platform REST API — gigs, proposals, contracts and payments, built with Django.",
    stack: ["Python", "Django", "DRF", "PostgreSQL"],
    github: "https://github.com/Oluwatemmy/gigflow-api",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "YouTube Downloader Pro",
    desc: "High-performance downloader with an async backend for concurrent downloads, 360p–4K quality selection and real-time progress tracking.",
    stack: ["Python", "FastAPI", "Asyncio", "yt-dlp"],
    github: "https://github.com/Oluwatemmy/Youtube-Downloader",
    live: null,
    category: "tool",
    featured: false
  },
  {
    name: "Student Management API",
    desc: "School management REST API — admin functions, student registration, course creation and a grading system.",
    stack: ["Python", "Flask-RESTX", "PostgreSQL"],
    github: "https://github.com/Oluwatemmy/Student-Management-API",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "LinkEase",
    desc: "Link-sharing web app with URL shortening and QR code generation.",
    stack: ["Python", "Flask", "Bootstrap"],
    github: "https://github.com/Oluwatemmy/Link-Ease",
    live: null,
    category: "app",
    featured: false
  },
  {
    name: "Invoice Generator",
    desc: "Minimal Flask app for generating clean, printable invoices.",
    stack: ["Python", "Flask"],
    github: "https://github.com/Oluwatemmy/invoice-generator",
    live: null,
    category: "app",
    featured: false
  },
  {
    name: "Authease Blog Demo",
    desc: "Full-featured Django blog built to showcase Authease handling real authentication in a working app.",
    stack: ["Python", "Django", "Authease"],
    github: "https://github.com/Oluwatemmy/authease-blog-demo",
    live: null,
    category: "app",
    featured: false
  },
  {
    name: "Authease API",
    desc: "RESTful API for Authease — authentication endpoints with strict type validation and PostgreSQL persistence.",
    stack: ["Python", "DRF", "PostgreSQL"],
    github: "https://github.com/Oluwatemmy/authease-api",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "Pizza Delivery API",
    desc: "Pizza ordering and delivery REST API built with Flask-RESTX.",
    stack: ["Python", "Flask-RESTX"],
    github: "https://github.com/Oluwatemmy/Pizza-Delivery-App",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "Stores REST API",
    desc: "Store and inventory management REST API with JWT-protected endpoints.",
    stack: ["Python", "Flask", "JWT"],
    github: "https://github.com/Oluwatemmy/stores-rest-api",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "Blog API",
    desc: "Blogging platform REST API — posts, comments and user management.",
    stack: ["Python", "Django"],
    github: "https://github.com/Oluwatemmy/Blog-API",
    live: null,
    category: "api",
    featured: false
  },
  {
    name: "BaseScan Scraper",
    desc: "Python scraper extracting on-chain data from BaseScan.",
    stack: ["Python", "Scraping"],
    github: "https://github.com/Oluwatemmy/BaseScan-Scraper",
    live: null,
    category: "tool",
    featured: false
  }
];

var CATEGORY_LABELS = {
  package: "PyPI Package",
  api: "REST API",
  app: "Web App",
  tool: "Tool"
};

(function () {
  var grid = document.getElementById("projects-grid");
  if (!grid) return;

  function render(filter) {
    var html = "";
    PROJECTS.forEach(function (p) {
      if (filter !== "all" && p.category !== filter) return;
      var badge = p.featured
        ? '<div class="project-category featured">&#9733; ' + CATEGORY_LABELS[p.category] + "</div>"
        : '<div class="project-category">' + CATEGORY_LABELS[p.category] + "</div>";
      var stack = p.stack.map(function (s) { return "<li>" + s + "</li>"; }).join("");
      var links =
        '<a href="' + p.github + '" target="_blank" rel="noopener"><i class="fa fa-github"></i>GitHub</a>' +
        (p.live ? '<a href="' + p.live + '" target="_blank" rel="noopener"><i class="fa fa-external-link"></i>Live</a>' : "");
      html +=
        '<div class="col-12 col-md-6 col-lg-4 mb-4">' +
          '<div class="project-card">' +
            badge +
            "<h4>" + p.name + "</h4>" +
            "<p>" + p.desc + "</p>" +
            '<ul class="project-stack">' + stack + "</ul>" +
            '<div class="project-links">' + links + "</div>" +
          "</div>" +
        "</div>";
    });
    grid.innerHTML = html;
  }

  document.querySelectorAll(".portfolio-filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".portfolio-filters button").forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");
      render(this.getAttribute("data-filter"));
    });
  });

  render("all");
})();
```

- [ ] **Step 3: Update the script block in `index.html`**

In the bottom script block, DELETE these four lines:

```html
    <script src="js/imagesloaded.pkgd.min.js"></script>
    <script src="js/masonry.pkgd.min.js"></script>
    <script src="js/cbpGridGallery.js"></script>
    <script src="js/jquery.hoverdir.js"></script>
```

and ADD (after `<script src="js/custom.js"></script>`):

```html
    <script src="js/projects.js"></script>
```

- [ ] **Step 4: Verify**

Reload → Portfolio. Expected: 12 cards render, Authease first with "★ PyPI Package" badge and both GitHub + Live links; all other cards GitHub-only. Clicking "REST APIs" shows exactly 6 cards (GigFlow, Student Management, Authease API, Pizza, Stores, Blog API); "Packages" shows 1; "Web Apps" 3; "Tools" 2. Console: zero errors.

- [ ] **Step 5: Checkpoint** — user reviews/commits.

---

### Task 9: Contact — Netlify Forms

**Files:**
- Modify: `index.html:606-693` (form + SmtpJS block)
- Modify: `js/custom.js` (replace dead AJAX block, remove gallery/video code)

- [ ] **Step 1: Replace the form** (`index.html:607-633`) with:

```html
                <div class="col-12 col-lg-8">
                  <form id="contactform" class="contactform" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
                    <input type="hidden" name="form-name" value="contact">
                    <p class="d-none">
                      <label>Don't fill this out if you're human: <input name="bot-field"></label>
                    </p>
                    <div class="contactform">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <input autocomplete="off" type="text" name="name" id="name" placeholder="YOUR NAME*" required>
                        </div>
                        <div class="col-12 col-md-4">
                          <input autocomplete="off" type="email" name="email" id="email" placeholder="YOUR EMAIL*" required>
                        </div>
                        <div class="col-12 col-md-4">
                          <input autocomplete="off" type="text" name="subject" id="subject" placeholder="YOUR SUBJECT">
                        </div>
                        <div class="col-12">
                          <textarea name="message" id="message" placeholder="YOUR MESSAGE*" required></textarea>
                          <button type="submit" class="button">
                            <span class="button-text">Send Message</span>
                            <span class="button-icon fa fa-send"></span>
                          </button>
                        </div>
                        <div class="col-12 form-message">
                          <span class="output_message text-center font-weight-600 text-uppercase"></span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
```

- [ ] **Step 2: Delete the SmtpJS block**

Delete `index.html:642-693` entirely — the `<script src="https://smtpjs.com/v3/smtp.js"></script>` line and the whole inline `<script>...sendEmail()...</script>` block (this removes the exposed SecureToken).

- [ ] **Step 3: Replace the AJAX contact-form block in `js/custom.js`**

Replace the block at `js/custom.js:125-143` (`$("#contactform").on("submit", ...)`) with:

```js
		$("#contactform").on("submit", function(e) {
			e.preventDefault();
			var $out = $(this).find(".output_message");
			$out.removeClass("success error").css("color", "").text("Sending...");
			var form = this;
			fetch("/", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(new FormData(form)).toString()
			}).then(function(response) {
				if (response.ok) {
					$out.css("color", "#3fb950").text("Message sent successfully!");
					form.reset();
				} else {
					$out.css("color", "#f85149").text("Failed to send. Please email me directly.");
				}
			}).catch(function() {
				$out.css("color", "#f85149").text("Failed to send. Please email me directly.");
			});
		});
```

- [ ] **Step 4: Remove dead template code from `js/custom.js`**

Still in `js/custom.js`, delete these blocks (the markup they target no longer exists):
- `function stop_videos() {...}` (lines 9–15)
- `$('.slideshow nav span').on('click', ...)` block (lines 36–38)
- `if ($('.gridlist').length) { new CBPGridGallery(...) }` block (lines 73–75) — **this fixes the console crash**
- `$(".gridlist figure").on('click', ...)` block (lines 81–86)
- `$(".nav-close")...`, `$(".nav-prev")...`, `$(".nav-next")...` blocks (lines 92–107)
- The hoverdir loop `var item = $(".gridlist li figure"); ... $(item[i]).hoverdir();` (lines 113–119)
- The whole `$(document).keyup(...)` block (lines 147–160) — it only serviced the removed slideshow and calls the removed `stop_videos()`

Keep: preloader block, mobile menu blocks, desktop menu block, and the new contact form block.

- [ ] **Step 5: Verify**

Reload → Contact. Submitting locally will show the error message (no Netlify backend on localhost — expected). Console: zero errors on load and on submit attempt. View source: no SecureToken anywhere.

- [ ] **Step 6: Post-deploy note for the user**

After the next Netlify deploy: Netlify dashboard → Site → Forms → verify "contact" form is detected → Settings → Forms → Form notifications → add email notification to `oluwaseyitemitope456@gmail.com`.

- [ ] **Step 7: Checkpoint** — user reviews/commits.

---

### Task 10: Delete dead files

**Files:** deletions only

- [ ] **Step 1: Delete unused CSS/JS**

```bash
rm css/skins/blue.css css/skins/blueviolet.css css/skins/goldenrod.css css/skins/green.css css/skins/magenta.css css/skins/orange.css css/skins/purple.css css/skins/red.css css/skins/yellow.css css/skins/yellowgreen.css
rm css/styleswitcher.css
rm js/styleswitcher.js js/cbpGridGallery.js js/masonry.pkgd.min.js js/imagesloaded.pkgd.min.js js/jquery.hoverdir.js
```

(Leaves only `css/skins/ember.css` in skins.)

- [ ] **Step 2: Delete unused images/media**

```bash
rm -rf img/styleswitcher img/blog img/projects/navigation
rm img/projects/video.mp4
rm img/projects/authease_api.png img/projects/black_jack.jpeg img/projects/linkease_homepage.png img/projects/pypi_authease.png
rm img/projects/project-1.jpg img/projects/project-2.png img/projects/project-3.webp img/projects/project-4.png img/projects/project-5.jpg img/projects/project-6.png
rm img/projects/css.svg img/projects/devicon--git.svg img/projects/html.svg img/projects/javascript.svg img/projects/logos--postgresql.svg img/projects/python.svg img/projects/react.svg img/projects/simple-icons--flask.svg img/projects/skill-icons--django.svg img/projects/skill-icons--heroku.svg
```

Keep: `img/AOTEM.png`, `img/mylogo.png`, `img/img-mobile.jpg`.

- [ ] **Step 3: Verify nothing references deleted files**

```bash
grep -rn "styleswitcher\|cbpGridGallery\|masonry\|imagesloaded\|hoverdir\|skins/yellow\|img/projects/" index.html js/custom.js js/menu.js js/main.js
```

Expected: no matches (or only matches inside `js/projects.js` comments — there should be none there either).

- [ ] **Step 4: Verify site still loads clean**

Reload `http://localhost:8080` — Network tab: zero 404s; Console: zero errors.

- [ ] **Step 5: Checkpoint** — user reviews/commits.

---

### Task 11: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Console + network audit**

With `python -m http.server 8080` running, use Playwright MCP: `browser_navigate` to `http://localhost:8080`, then `browser_console_messages` (level: error). Expected: **0 errors** (live site currently has 3). `browser_network_requests`: no 404s, fonts.googleapis.com loads.

- [ ] **Step 2: Desktop walkthrough (1280px+)**

Navigate all 4 sections via the side nav. Screenshot each. Check: Ember colors everywhere (no `#ffb400` yellow, no blue), Poppins headings actually rendering (compare a heading against a system-font fallback — letterforms should be geometric), all 4 sections styled consistently.

- [ ] **Step 3: Mobile walkthrough (390×844)**

`browser_resize` to 390×844, reload, walk all 4 sections via the hamburger menu. Check: hero photo visible on Home, skill cards stack 1-per-row, project cards stack 1-per-row, form usable.

- [ ] **Step 4: Functional checks**

- "View Projects" hero button → Portfolio section, briefcase icon active.
- "More About Me" → About.
- Each filter tab shows the right card count (All=12, Packages=1, REST APIs=6, Web Apps=3, Tools=2).
- Every GitHub link opens the right repo (spot-check 3); Authease "Live" opens PyPI.
- Download CV downloads the PDF.
- Contact submit on localhost shows the failure message gracefully (expected without Netlify), no console error.

- [ ] **Step 5: Report results to user** — list any deviations found and fixed. Remind about the two manual post-deploy steps: (1) Netlify Forms email notification setup, (2) verify form detection on first deploy preview.

---

## Post-launch (user's manual steps)

1. Commit and push (user handles all commits).
2. Netlify deploy → Forms → enable email notification to `oluwaseyitemitope456@gmail.com`.
3. Send a test message through the live contact form.
4. Optional later: deploy projects on free tiers (Render/Railway/Fly.io) and fill in their `live:` fields in `js/projects.js`.
