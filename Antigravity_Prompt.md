# Antigravity Master Prompt
## Nisar Khan & Sons — Tiles Shop Management System

You are building a production-grade, full-stack SaaS web application for a tiles retail shop in Pakistan called Nisar Khan & Sons. A detailed PRD is attached. Read it fully before writing any code.

---

## Your Role

You are a senior full-stack engineer. You will scaffold and build this entire application from scratch following the PRD exactly. Do not make assumptions — if something is unclear, ask before building. Do not simplify or skip features marked as required in the PRD.

---

## Tech Stack (Non-Negotiable)

- Framework: Next.js 14 with App Router
- Database and Auth: Supabase (PostgreSQL + Supabase Auth)
- Styling: Tailwind CSS
- Components: shadcn/ui (customized to the dark theme in the PRD)
- Charts: Recharts
- PDF Export: jsPDF
- Excel Export: SheetJS (xlsx)
- Hosting target: Vercel
- Language: TypeScript throughout — no plain JS files

Do not introduce any libraries or tools not listed here without asking first.

---

## Design System (Strict — Follow Exactly)

The app uses a dark cyberpunk theme. Do not use the default shadcn/ui light theme. Override all component styles to match the following.

### Colors (set as CSS variables in globals.css)

--bg-base: #0A0A0A
--bg-surface: #111111
--bg-elevated: #1A1A1A
--bg-hover: #222222
--accent-primary: #39FF14
--accent-dim: #22CC00
--accent-glow: rgba(57, 255, 20, 0.15)
--text-primary: #F0F0F0
--text-secondary: #888888
--text-muted: #555555
--border: #2A2A2A
--border-accent: #39FF14
--danger: #FF4444
--warning: #FFB800

### Fonts (load via Google Fonts)

- Display and Headings: Rajdhani (700, 600)
- Body: Inter (400, 500)
- Numbers and Stats: JetBrains Mono (600)

### Key UI Rules

- Sidebar: fixed left, 240px expanded, collapses to 64px icon rail
- Active nav item: 4px left green border, green text, faint green background
- Primary buttons: #39FF14 background, black text, glow on hover
- Secondary buttons: transparent, green border, green text
- Inputs: #1A1A1A background, #2A2A2A border, #39FF14 border on focus
- Cards: #111111 background, 1px solid #2A2A2A border, border-radius 8px
- Tables: alternating rows #111111 / #151515, green highlight on row hover
- All charts: dark background, #2A2A2A grid lines, #39FF14 as the primary color

---

## How to Build This — Phase by Phase

Build the application feature by feature in this exact order. Confirm completion of each phase before moving to the next.

### Phase 1 — Foundation
1. Initialize Next.js 14 project with TypeScript, Tailwind, App Router
2. Install and configure shadcn/ui, override theme to the dark design system above
3. Set up Supabase — create all tables and RLS policies per the schema in the PRD
4. Set up Supabase Auth (email/password only)
5. Build the layout shell: Sidebar, Topbar, responsive container
6. Build the login page at /auth/login with Supabase Auth
7. Set up Next.js middleware.ts to protect all routes
8. Set up role-based access: read user_profiles.role after login and store in context

### Phase 2 — Inventory
9. Build /inventory — product list table with search, filters, pagination, stock status badges
10. Build /inventory/add — add product form (admin only, cost price hidden from staff)
11. Build /inventory/[id] — product detail and edit page with stock quick-adjust and edit log

### Phase 3 — Sales
12. Build /sales — sales list table with search, filters, pagination
13. Build /sales/add — record new sale page with product search, line items, payment section, and auto stock deduction
14. Build /sales/[id] — sale detail view formatted as a clean invoice

### Phase 4 — Dashboard
15. Build /dashboard — admin variant with all 8 widgets per the PRD
16. Build staff variant of /dashboard with limited widgets (no financial figures)
17. Integrate Recharts for the sales line chart and payment method donut chart

### Phase 5 — Reports
18. Build /reports hub page
19. Build each sub-report: sales summary, by-product, inventory status, low stock, daily log
20. Add date range filters to all reports

### Phase 6 — Export
21. Add PDF export to sale detail page using jsPDF (formatted invoice layout)
22. Add PDF and Excel export buttons to all report pages

### Phase 7 — Users and Settings
23. Build /users — user management page (admin only): list, add, edit, deactivate
24. Build /settings page

### Phase 8 — Polish
25. Add toast notifications (success and error) to all forms and actions
26. Add confirmation dialogs for all destructive actions (delete, deactivate)
27. Add empty states to all tables and lists
28. Full responsive pass — bottom nav on mobile, collapsed sidebar on tablet
29. Final review against PRD checklist

---

## Critical Rules

- TypeScript strict mode — no any types
- Use Server Actions or API Routes for all database mutations — do not call Supabase directly from client components for writes
- RLS must be enabled on all Supabase tables — do not rely on frontend-only access control
- The cost_price column must NEVER be returned to staff users. Exclude it at the database level using a Supabase view called products_public that omits this column. Staff queries use this view. Admin queries use the full products table.
- All currency displayed as PKR with comma formatting: PKR 1,25,000
- All dates displayed in DD/MM/YYYY format
- Sale numbers auto-generated sequentially in the format INV-2026-0001
- Stock must be auto-deducted when a sale is saved — use a Supabase RPC function or transaction to ensure this is atomic
- Soft deletes only — never hard delete products or users (set is_active = false)
- Staff can only see their own sales — enforce this via RLS policy on the sales table

---

## Folder Structure to Follow

/app
  /auth/login/page.tsx
  /dashboard/page.tsx
  /inventory/page.tsx
  /inventory/add/page.tsx
  /inventory/[id]/page.tsx
  /sales/page.tsx
  /sales/add/page.tsx
  /sales/[id]/page.tsx
  /reports/page.tsx
  /reports/sales-summary/page.tsx
  /reports/by-product/page.tsx
  /reports/inventory-status/page.tsx
  /reports/low-stock/page.tsx
  /reports/daily-log/page.tsx
  /users/page.tsx
  /settings/page.tsx
  /unauthorized/page.tsx

/components
  /layout — Sidebar.tsx, Topbar.tsx, PageWrapper.tsx
  /ui — shadcn components customized to dark theme
  /inventory
  /sales
  /reports
  /dashboard

/lib
  supabase.ts — Supabase browser client
  supabase-server.ts — Supabase server/server actions client
  utils.ts
  formatters.ts — PKR and date formatting helpers

/types
  index.ts — all shared TypeScript interfaces

middleware.ts — auth and role-based route protection

---

## What to Reference in the PRD

- Full database schema with all table fields and SQL
- Complete list of form fields for every page
- All filter, search, and sort options per table
- Exact widget list for admin vs staff dashboard
- All five report definitions
- Permission matrix per role (admin vs staff)
- Non-functional requirements covering performance, security, and accessibility

---

Start with Phase 1. Confirm when each phase is complete before moving to the next. Ask before making any decision not covered in the PRD.
