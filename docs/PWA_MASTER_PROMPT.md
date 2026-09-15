# MASTER ENGINEERING SPECIFICATION & PROMPT: BRANDEX UNIFIED ASTRO PWA

> **Command**: Run this specification with `/goal` to autonomously execute the end-to-end implementation of the unified Brandex Progressive Web App.

---

## 1. PROJECT VISION & HIGH-LEVEL OBJECTIVES
Brandex is transitioning from a standalone community portal to an **All-in-One Progressive Web App (PWA)** that unifies every facet of the Brandex ecosystem under a single, installable, offline-first experience:
1. **Service Booking Engine** (Systems audits, enterprise AI agent deployment, security sprints, institutional training).
2. **Community & Domain Circles** (AI Engineering, Cybersecurity & Defense, Distributed Systems, Swiss Editorial UX).
3. **Open-Source Project Registry** (Curated repositories, Good First Issue claims, live PR leaderboard).
4. **Careers & Chapter Leadership** (Campus Ambassador tracks, research fellowships, core engineer roles).
5. **Interactive Curriculum & Learning** (Cohort syllabus, downloadable templates, offline-cached study notes).
6. **Pseudo-Anonymous Identity & Application Tracker** (Discord/Reddit-style handles, WebAuthn Passkeys, deterministic `BX-` and `SRV-` verification).

---

## 2. STRICT BRAND IDENTITY & DESIGN SYSTEM
- **Prohibited Aesthetics**:
  - NO purple-magenta neon gradients.
  - NO oversaturated glowing blobs, cyber-lines, or AI-generated visual clutter.
- **Approved Aesthetic: Swiss Editorial & Modern Engineering Minimalism**:
  - **Typography**: `Inter` for body copy and headings, `JetBrains Mono` for code snippets, metrics, and reference IDs.
  - **Color Tokens**:
    - **Light Mode**:
      - Background Canvas: `#FFFFFF` / `#F8FAFC`
      - Surface Cards: `rgba(255, 255, 255, 0.85)` with `border-slate-200/90`
      - Primary Accent: Deep Indigo (`#4338CA` / `#4F46E5`)
      - Secondary Accent: Deep Slate (`#0F172A`)
      - Text Primary: `#0F172A`, Text Muted: `#64748B`
    - **Dark Mode**:
      - Background Canvas: `#030712`
      - Surface Cards: `rgba(15, 23, 42, 0.65)` with `border-slate-800/90`
      - Primary Accent: Clean Indigo (`#6366F1`)
      - Text Primary: `#F9FAFB`, Text Muted: `#94A3B8`
  - **Micro-Interactions**: Subtle border glows on focus (`ring-4 ring-indigo-500/10`), active card depression (`active:scale-[0.98] transition-all`), smooth fade-in transitions (`animate-fade-in`).

---

## 3. CORE TECHNOLOGY STACK & ARCHITECTURE
- **Root Web Framework**: **Astro 5** (Hybrid Mode).
  - Handles SSG (Static Site Generation) for marketing, blog posts, domain circle landing pages, and documentation to guarantee 100/100 Core Web Vitals and zero-JS initial render for search crawlers.
  - Server endpoints (`src/pages/api/*`) handle SSR API requests, session validation, and database operations.
- **Interactive UI Layer**: **React 19 + TypeScript + Tailwind CSS** as Astro Client Islands (`client:load`, `client:idle`, `client:visible`).
- **PWA & Offline Service Worker**: **Vite PWA Plugin + Workbox**:
  - Stale-While-Revalidate caching for community feeds and open-source project registries.
  - Cache-First for static assets, SVG icons, and Google Fonts.
  - `IndexedDB` storage via `idb` for caching learning notes and queueing background sync mutations.
- **Backend & Database**: **Node.js / Express or Astro SSR Endpoints** connected to **SQLite / PostgreSQL via Drizzle ORM**:
  - Zero mock data. Every entity (bookings, users, applications, repos, notes) is stored in persistent tables.
- **Security & Headers**: `Helmet`, strict CORS, Content Security Policy, rate limiting (`express-rate-limit`), and Zod request schema validation.

---

## 4. ZERO-PII PSEUDO-ANONYMOUS IDENTITY SYSTEM
Following the Reddit and Discord privacy-first paradigms:
1. **Zero Real PII Storage**:
   - The database shall NEVER store real legal names, phone numbers, or invasive tracking cookies.
2. **Anonymous Handle & Avatar Generation**:
   - When a user first opens the PWA, a unique cryptographic handle is generated or chosen (e.g. `@kernel_sprint_88`, `@agentic_builder_04`).
   - Algorithmic avatar generated using deterministic SVG identicons (BoringAvatars or DiceBear).
3. **Authentication via WebAuthn Passkeys**:
   - Users authenticate using device biometrics (TouchID, FaceID, Windows Hello, or YubiKey) via FIDO2 / WebAuthn.
   - Fallback: Ephemeral cryptographic session tokens stored in secure, `HTTP-Only`, `SameSite=Strict` cookies.
4. **Deterministic Reference IDs**:
   - Applications: `BX-2026-XXXX`.
   - Service Bookings: `SRV-2026-XXXX`.
   - Users can track their applications anonymously anytime by entering their Reference ID.

---

## 5. COMPLETE MODULE SPECIFICATIONS

### Module 1: Service Booking Engine
- **Service Categories**:
  1. *Architecture & High-Concurrency Scalability Audit* (Go/Rust/Node load testing, database bottleneck analysis).
  2. *Enterprise GenAI & Multi-Agent Workflow Implementation* (RAG architectures, local LLMs, tool-calling pipelines).
  3. *Cybersecurity Penetration Test & Sandbox Defense Sprint* (API vulnerabilities, OWASP Top 10, infrastructure audit).
  4. *Custom Institutional Coding Curriculum & Masterclasses* (Tailored syllabus for engineering schools and universities).
- **Booking Flow**:
  - Step 1: Select service tier and deliverables checklist.
  - Step 2: Scope description & tech stack input (min 30 characters).
  - Step 3: Interactive slot picker (live availability calendar).
  - Step 4: Confirm request-a-quote (zero payment PII required; generates `SRV-2026-XXXX` receipt).
  - Offline handling: If offline, the booking is queued in IndexedDB and dispatched via Background Sync once internet returns.

### Module 2: Community & Domain Circles
- **4 Core Disciplines**:
  - *Artificial Intelligence Circle* (Transformers, Vector Search, Agents, LLM Fine-Tuning).
  - *Cybersecurity & Defense Circle* (Offensive & Defensive Security, Weekly CTFs, Sandboxes).
  - *Distributed Systems Circle* (High-throughput Engines, Go/Rust, Cloud-Native, Kubernetes).
  - *Swiss Editorial UX & Design Circle* (Typography, Component Systems, Micro-Interactions).
- **Onboarding Form**:
  - Step 1: Profile (Name or Handle, Anonymous Contact, Primary Role with typeable "Other" field, Institution).
  - Step 2: Domain Circles (Multi-select with custom topic input).
  - Step 3: Experience Level (Beginner, Intermediate, Advanced).
  - Step 4: "What Will You Bring & Build?" (Contribution role, focus tags, min 20-character project vision).
  - Strictly locked submit button until all required questions are answered.

### Module 3: Open-Source Project Registry
- **Curated Repositories**:
  - Displays Brandex open-source repos (Geniusphere, Swiss UI, Autonomous Code Audit Agent).
  - Real-time GitHub sync: Stars, Forks, Open Issues, License badge.
  - "Good First Issue" filter: Allows developers to filter beginner-friendly issues.
  - Public PR Verification: Users submit their merged PR URL, backend calls the GitHub public API to verify merge status and awards contributor badges without requiring GitHub OAuth credentials.

### Module 4: Careers & Leadership Gateway
- **Open Opportunities**:
  - *Campus Lead & Chapter Coordinator* (Student ambassadors for colleges).
  - *Core Systems & GenAI Research Fellowships* (Paid technical research positions).
  - *Open Source Working Circle Leads* (Lab organizers and paper discussion hosts).
- **Features**: Application pipeline with prerequisite checklists and real-time status tracking.

### Module 5: Interactive Learning & Offline Curriculum
- **Curriculum Units**:
  - Structured syllabus modules covering AI, Systems, and Security.
  - Code templates, architecture diagrams, and lab sheets.
  - **Offline Reader**: All learning tracks and notes are pre-cached in IndexedDB via the Service Worker, allowing uninterrupted reading on mobile or transit.

### Module 6: Pseudo-Anonymous Status Tracker
- **Endpoint**: `/api/status?id=BX-2026-XXXX`.
- **States**: `Application Received` -> `Under Technical Review` -> `Accepted & Queued` -> `Dispatched`.
- Upon approval, reveals private Discord/WhatsApp circle access links and assigned mentor notes.

### Module 7: Encrypted Web Push Notification Engine
- **Native Web Push (VAPID)**:
  - Users can enable browser push notifications with 1-click.
  - Zero email or phone number required.
  - Dispatches updates when an application status changes, when a booking is confirmed, or 1 hour before a circle lab starts.
  - In-app notification center bell icon with unread badge count.

---

## 6. DATABASE SCHEMA DEFINITIONS (Drizzle ORM / SQLite)
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  handle: text('handle').unique().notNull(),
  avatarSeed: text('avatar_seed').notNull(),
  credentialId: text('credential_id'),
  publicKey: text('public_key'),
  createdAt: text('created_at').notNull(),
});

export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(), // BX-2026-XXXX
  userHandle: text('user_handle').notNull(),
  type: text('type').notNull(), // 'community' | 'cohort' | 'ambassador'
  domains: text('domains', { mode: 'json' }).notNull(),
  experienceLevel: text('experience_level').notNull(),
  contributions: text('contributions', { mode: 'json' }).notNull(),
  projectIdea: text('project_idea').notNull(),
  status: text('status').notNull().default('Under Review'),
  reviewerNotes: text('reviewer_notes'),
  createdAt: text('created_at').notNull(),
});

export const serviceBookings = sqliteTable('service_bookings', {
  id: text('id').primaryKey(), // SRV-2026-XXXX
  userHandle: text('user_handle').notNull(),
  serviceTitle: text('service_title').notNull(),
  organization: text('organization').notNull(),
  preferredSlot: text('preferred_slot').notNull(),
  scopeNotes: text('scope_notes').notNull(),
  status: text('status').notNull().default('Scheduled'),
  createdAt: text('created_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  repoUrl: text('repo_url').notNull(),
  techStack: text('tech_stack', { mode: 'json' }).notNull(),
  starsCount: integer('stars_count').default(0),
  openIssuesCount: integer('open_issues_count').default(0),
});

export const contributions = sqliteTable('contributions', {
  id: text('id').primaryKey(),
  userHandle: text('user_handle').notNull(),
  projectId: text('project_id').notNull(),
  prUrl: text('pr_url').notNull(),
  verified: integer('verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: text('id').primaryKey(),
  userHandle: text('user_handle').notNull(),
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: text('created_at').notNull(),
});
```

---

## 7. PROGRESSIVE IN-PLACE MIGRATION ROADMAP
1. **Phase 1: Setup Astro 5 & React Islands in Root**:
   - Install `astro`, `@astrojs/react`, `@astrojs/tailwind`.
   - Setup `astro.config.mjs` with hybrid output mode.
   - Configure Tailwind with Brandex Swiss palette (Deep Indigo, Slate, Dark Canvas).
2. **Phase 2: Migrate Pages to Astro with Islands**:
   - Convert static content (Home, About, Guidelines, Media) to `.astro` pages.
   - Keep interactive modals and dashboards as React islands (`<RegistrationModal client:idle />`, `<ServiceBookingWizard client:visible />`).
3. **Phase 3: Implement Workbox PWA & Service Worker**:
   - Generate `manifest.webmanifest`.
   - Register custom Service Worker with IndexedDB offline queueing and background sync.
4. **Phase 4: Build Backend Endpoints & Database**:
   - Setup Drizzle ORM with SQLite file (`data/brandex.db`).
   - Implement `/api/book-service`, `/api/applications`, `/api/status`, `/api/verify-pr`.
5. **Phase 5: Web Push & Pseudo-Anonymous Auth**:
   - WebAuthn registration/assertion handlers + VAPID push dispatcher.
6. **Phase 6: Comprehensive Verification**:
   - Lighthouse score `>= 95` in all categories.
   - Complete offline simulation and background sync verification.

