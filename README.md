# 🚀 Project Blueprint: Production-Ready "Saraha" Clone

This is a comprehensive, production-grade architectural specification document for building a modern, vibrant, and multi-themed anonymous messaging platform using **Next.js 16** and **Tailwind CSS v4.1**.

---

## 🛠️ 1. Tech Stack Specs (2026 Production Standard)

- **Core Framework:** Next.js v16 (App Router, Server Actions, Strict Server/Client component isolation).
- **Styling & UI:** Tailwind CSS v4.1 (Native CSS `@theme` config) + Shadcn UI.
- **State Management:** Zustand (Store slicing, persistent middleware for preferences).
- **Data Fetching:** TanStack React Query v5+ (Optimistic updates, aggressive caching strategy).
- **Forms & Validation:** React Hook Form + Zod (Shared schemas for frontend/backend validation).
- **Internationalization:** `next-intl` (Fully localized URL routing: `/ar` and `/en`).
- **Theme Engine:** `next-themes` (Supporting Light/Dark + Multi-color themes via CSS Variables).
- **Testing Suite:** Vitest + React Testing Library (Unit/Integration), Playwright (E2E).

---

## 🎨 2. Theme & Visual Engineering (Tailwind v4.1 Dynamic Matrix)

The application utilizes Next-Themes to inject a `data-theme` and `class` attributes into the `<html>` tag. You must configure the main CSS file using Tailwind v4.1 `@theme` syntax to map CSS variables dynamic paths:

### Theme Configurations Matrix:

1. **Neon Violet (Default):** High energy, vibrant mesh gradients.
2. **Emerald Cyber:** Clean tech, dark deep green tones with neon green accents.
3. **Sunset Glow:** Warm, elegant corporate luxury (Earthy oranges, deep burgundy, and gold accents).
4. **Ocean Breeze:** Refreshing, deep royal blues mixed with cyan and ice-blue glassmorphism.

### Tailwind v4.1 Theme Mapping Layout (`app/globals.css`):

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: var(--brand-primary);
  --color-brand-secondary: var(--brand-secondary);
  --color-bg-main: var(--bg-main);
  --color-card-glass: var(--card-glass);
}

/* Theme Variances */
[data-theme="violet"] {
  --brand-primary: #7c3aed; --brand-secondary: #db2777;
  --bg-main: #090514; --card-glass: rgba(255, 255, 255, 0.03);
}
[data-theme="emerald"] {
  --brand-primary: #059669; --brand-secondary: #10b981;
  --bg-main: #022c22; --card-glass: rgba(5, 150, 105, 0.05);
}
/* Apply alternative configurations for Light Mode wrapper inside each theme */
.light [data-theme="violet"] {
  --bg-main: #f9f5ff; --card-glass: rgba(255, 255, 255, 0.7);
}

🏗️ 3. Production Best Practices & Architecture
To achieve a resilient Production Environment, enforce the following architectural patterns:

Separation of Concerns (Layered Architecture):

UI Layer (/components): Dumb, atomic, and presentation-focused components.

Service Layer (/services): Pure API Client functions using an abstracted wrapper. No direct fetch calls inside components.

Validation Layer (/lib/validations): Centralized Zod schemas shared across Client Forms and Server Actions.

Error Boundary & Resilience:

Implement localized error.tsx boundaries for dashboard segments.

Global App monitoring via unified Response interceptors in the API client layer.

Performance Optimization:

Mandatory loading.tsx skeletons for all asynchronous data states.

Dynamic imports (next/dynamic) for massive components (e.g., Theme Switchers, Complex charts).

Strict adherence to Layout shifting avoidance (CLS prevention).


📂 4. Scalable Directory Structure
src/
├── app/
│   └── [locale]/
│       ├── (auth)/
│       │   ├── login/page.tsx          # Credentials + Google OAuth
│       │   └── signup/page.tsx
│       ├── (dashboard)/
│       │   ├── dashboard/page.tsx      # Messages feeds (Glassmorphic cards)
│       │   ├── profile/page.tsx        # Public link manager & configurations
│       │   ├── settings/page.tsx       # Profile editor + Theme/Language switcher
│       │   └── notifications/page.tsx  # Dynamic unread counts
│       ├── u/[username]/page.tsx       # Anonymous message dispatch inbox
│       ├── verify-email/page.tsx
│       ├── layout.tsx                  # Injects dir(rtl/ltr), theme data, providers
│       └── page.tsx                    # Vibrant landing page with mesh background
├── components/                         # UI atomic elements (Shadcn extended)
├── hooks/                              # React Query wrapped hooks (e.g., useMessages)
├── lib/
│   └── validations/                    # Zod absolute strict validation schemas
├── messages/                           # i18n Dictionary mapping
│   ├── ar.json                         # Strict Arabic translations (RTL alignment)
│   └── en.json                         # Strict English translations (LTR alignment)
├── services/                           # Backend API Layer Abstraction
│   └── api-client.ts                   # Centralized Axios/Fetch Wrapper
└── store/                              # Zustand Global States (Theme, Client Session)


🔌 5. Backend Integration Readiness (Plug-and-Play Protocol)
The frontend must be entirely agnostic of backend implementation details.

All API interactions must flow through src/services/api-client.ts.

Use an environment variable NEXT_PUBLIC_API_BASE_URL for endpoints.

Provide a full set of Mock API Response configurations mimicking production behavior within the service files, allowing the app to run completely offline with mock data by switching a toggle NEXT_PUBLIC_ENABLE_MOCKS=true.

🧪 6. Mandatory Automation Testing Strategy
You must build the test suites simultaneously with feature deployment:

A. Unit & Integration Testing (Vitest + React Testing Library)
Forms & Zod Guard: Validate that invalid emails/passwords/messages trigger localized Zod translation errors.

Theme & i18n Stores: Test state shifts when swapping between themes (violet -> emerald) and languages (ar -> en).

Directionality (RTL/LTR): Assert layout adjustments apply dir="rtl" dynamically when navigating to Arabic views.

B. End-to-End (E2E) Testing (Playwright)
Authentications Pipeline: Test registration -> fake verification token -> dashboard initialization.

The Messaging Loop: Open anonymous link /u/mustafa -> Send message -> Log in as receiver -> Validate Real-time/Polled delivery with unread indicator badge on Notification tab.

🤖 AI Execution Directives (System Prompts)
Execute the build sequentially: Phase 1 (Setup/Themes) -> Phase 2 (i18n & Layouts) -> Phase 3 (Auth/Forms) -> Phase 4 (Services Mock Layer) -> Phase 5 (Testing Suite Setup).

CRITICAL CODE RULES:

Never use directional style tokens (pl-*, pr-*, right-*, left-*). Use logical equivalents exclusively (ps-*, pe-*, end-*, start-*) to satisfy RTL rendering perfectly.

Ensure all UI elements contain explicit semantic definitions for ARIA compliance.

Verify all code paths pass strict TypeScript compilation and compiler options.

Once implementation finishes, execute the full test suite (npm run test:all) to verify structural stability before finalizing the build.


Markdown
## 🔗 7. Backend Schema Synchronization & Exact Data Mapping

To ensure seamless production integration, all frontend TypeScript interfaces and Zod schemas must explicitly match the database models (`userSchema` and `messageSchema`). 

### A. Strict TypeScript Data Models (`src/types/index.ts`)

```typescript
export enum ProvidersEnum {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE'
}

export enum UserRolesEnum {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string; // Maps to Mongoose _id
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  confirmedEmail: string | null; // Date string or null
  isActive: boolean;
  phone?: string;
  gender: number; // Mapped to GENDERS enum
  birthdate?: string; // Date string
  avatar?: string;
  description?: string;
  role: UserRolesEnum;
  provider: ProvidersEnum;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  fullName: string;
  age?: number;
}

export interface Message {
  id: string;
  content: string;
  image?: string;
  from: string | Partial<User>; // ObjectId Reference
  to: string | Partial<User>;   // ObjectId Reference
  createdAt: string;
}


B. Zod Validation Alignment Strategy (src/lib/validations/)
You must construct the Zod validation constraints to precisely mirror the backend limits and regex logic:

User Schema Constraints (auth.ts & profile.ts):

firstName: z.string().min(3, t('errors.firstName_min')).max(30, t('errors.firstName_max')).trim()

lastName: z.string().min(2, t('errors.lastName_min')).max(30, t('errors.lastName_max')).trim()

username: z.string().trim().toLowerCase()

email: z.string().trim().toLowerCase().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, t('errors.invalid_email'))

password: Conditional validation wrapper using .superRefine(). If provider === 'LOCAL', it must be .min(6, t('errors.password_min')).

birthdate: Must validate that the calculated age is > 18 using a client-side date engine.

Message Schema Constraints (message.ts):

content: z.string().min(1, t('errors.message_required'))

image: z.string().url().optional()

🤖 Directives for AI Implementation (Backend Binding Rules)
Form Attribute Naming: When building the Edit Profile and Authentication forms using react-hook-form, bind the name attribute exactly to the camelCase properties defined in the schema above (firstName, lastName, birthdate, etc.).

Payload Interception: Ensure that when submitting a new message from /u/[username], the payload structurally maps to the Message interface, tracking the to parameter (Receiver User ID) and content.

Mock Factory Updates: Update your Mock Service Layer (src/services/api-client.ts) to return JSON payloads containing these exact schema attributes, including the virtual properties (fullName, age) in the simulated responses.