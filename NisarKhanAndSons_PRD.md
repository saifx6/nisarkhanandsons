# Product Requirements Document (PRD)
## Nisar Khan & Sons — Tiles Shop Management System
**Version:** 1.0  
**Date:** April 2026  
**Prepared for:** Development Team  
**Client:** Nisar Khan & Sons, Pakistan

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Tech Stack](#4-tech-stack)
5. [Design System & UI/UX Guidelines](#5-design-system--uiux-guidelines)
6. [Application Architecture](#6-application-architecture)
7. [Feature Specifications](#7-feature-specifications)
   - 7.1 Authentication
   - 7.2 Dashboard (Home)
   - 7.3 Inventory Management
   - 7.4 Sales Management
   - 7.5 Reports & Analytics
   - 7.6 User Management (Admin)
   - 7.7 Export & Print
8. [Database Schema](#8-database-schema)
9. [Page & Route Map](#9-page--route-map)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Out of Scope (v1.0)](#11-out-of-scope-v10)
12. [Open Questions](#12-open-questions)

---

## 1. Project Overview

**Product Name:** Nisar Khan & Sons — Shop Management System  
**Type:** Internal SaaS Web Application  
**Client:** Nisar Khan & Sons (tiles retail shop, Pakistan)  
**Primary Purpose:** Replace manual (paper/Excel) record-keeping with a centralized digital system for managing tile inventory and sales records.

### Problem Statement

Nisar Khan & Sons currently manages all inventory tracking and sales recording manually — on paper or in basic spreadsheets. This causes:
- Slow and error-prone stock lookups
- No visibility into sales trends or top-selling products
- No centralized record of customer transactions
- Risk of data loss
- Difficulty tracking low-stock items

### Solution

A production-grade, full-stack web dashboard that gives the shop owner and sales staff a fast, reliable system to:
- Manage tile inventory (add, edit, update stock levels)
- Record all sales transactions
- View analytics and reports
- Export data to PDF or Excel

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Digitize all inventory records | 100% of tile products entered into system within onboarding |
| Record all sales digitally | Zero paper sales records after go-live |
| Reduce stock lookup time | Staff can find a product in < 10 seconds |
| Give owner business visibility | Owner can see daily/weekly/monthly sales from dashboard |
| Low-stock awareness | Automatic alerts when stock falls below threshold |

---

## 3. User Roles & Permissions

The system has two user roles:

### 3.1 Admin (Shop Owner)

The admin has full access to the entire system.

| Area | Access |
|------|--------|
| Dashboard | Full view |
| Inventory | Add, Edit, Delete, View |
| Sales | Add, Edit, Delete, View |
| Reports | Full access (all reports + export) |
| User Management | Create, Edit, Deactivate staff accounts |
| Settings | Full access |

### 3.2 Sales Staff / Cashier

Staff have access to day-to-day operational features only.

| Area | Access |
|------|--------|
| Dashboard | View (limited — no financial summaries) |
| Inventory | View only (cannot add/edit/delete) |
| Sales | Add new sales, View own sales records |
| Reports | No access |
| User Management | No access |
| Settings | No access |

> **Note:** Staff cannot see profit margins, cost prices, or financial reports. They can only see selling prices and record sales.

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) |
| **Backend** | Next.js API Routes / Server Actions |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **ORM / DB Client** | Supabase JS SDK |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui (customized to match design system) |
| **Charts** | Recharts |
| **Export** | jsPDF (PDF), SheetJS / xlsx (Excel) |
| **Hosting** | Vercel |
| **File Storage** | Supabase Storage (for product images, if needed) |

### 4.1 Project Structure (Next.js App Router)

```
/app
  /auth
    /login
  /dashboard
    page.tsx                  ← Home / overview
  /inventory
    page.tsx                  ← Inventory list
    /add
      page.tsx
    /[id]
      page.tsx                ← Product detail / edit
  /sales
    page.tsx                  ← Sales list
    /add
      page.tsx
    /[id]
      page.tsx                ← Sale detail
  /reports
    page.tsx                  ← Reports & analytics
  /users
    page.tsx                  ← User management (admin only)
  /settings
    page.tsx
/components
  /ui                         ← shadcn components
  /layout
    Sidebar.tsx
    Topbar.tsx
  /inventory
  /sales
  /reports
/lib
  supabase.ts
  utils.ts
/types
  index.ts
```

---

## 5. Design System & UI/UX Guidelines

### 5.1 Visual Identity

**Theme:** Dark — Cyberpunk / Industrial  
**Personality:** Bold, sharp, high-contrast. Feels like a command center. Neon green on deep black gives it a premium, modern edge that stands apart from generic dashboards.

### 5.2 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0A0A0A` | Page background |
| `--bg-surface` | `#111111` | Cards, sidebar |
| `--bg-elevated` | `#1A1A1A` | Table rows, inputs |
| `--bg-hover` | `#222222` | Hover states |
| `--accent-primary` | `#39FF14` | Neon green — CTAs, active states, highlights |
| `--accent-dim` | `#22CC00` | Darker green for hover on green elements |
| `--accent-glow` | `rgba(57,255,20,0.15)` | Glow effects behind green elements |
| `--text-primary` | `#F0F0F0` | Main text |
| `--text-secondary` | `#888888` | Labels, metadata |
| `--text-muted` | `#555555` | Placeholders, disabled |
| `--border` | `#2A2A2A` | Card/table borders |
| `--border-accent` | `#39FF14` | Focused inputs, active nav items |
| `--danger` | `#FF4444` | Errors, delete actions |
| `--warning` | `#FFB800` | Low stock warnings |
| `--success` | `#39FF14` | Success states (same as accent) |

### 5.3 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Page Titles | `Rajdhani` (Google Fonts) | 700 | 28–36px |
| Section Headings | `Rajdhani` | 600 | 20–24px |
| Body Text | `Inter` | 400 | 14px |
| Labels / Meta | `Inter` | 400 | 12px |
| Numbers / Stats | `JetBrains Mono` | 600 | varies |
| Table Data | `Inter` | 400 | 13px |

> Rajdhani is an Indian/Pakistani script-adjacent font that feels industrial and sharp — fitting both the aesthetic and cultural context.

### 5.4 Layout

- **Sidebar:** Fixed left sidebar, 240px wide, collapsible to icon rail (64px) on smaller screens
- **Topbar:** Fixed top bar with page title, user avatar, notification bell
- **Content Area:** Fluid, padded 24px, max-width 1400px centered
- **Cards:** `border-radius: 8px`, subtle `1px border`, faint glow on hover for key metric cards
- **Tables:** Dark striped rows (`#111` / `#151515`), green highlight on hover row

### 5.5 Component Styling Rules

**Buttons:**
- Primary: Neon green background (`#39FF14`), black text, bold. Slight glow on hover.
- Secondary: Transparent with green border, green text.
- Danger: Red background or red border variant.

**Inputs & Form Fields:**
- Background: `#1A1A1A`
- Border: `#2A2A2A` default, `#39FF14` on focus
- Label above field, not floating
- Error state: red border + red helper text below

**Badges / Status Pills:**
- In Stock: Green pill
- Low Stock: Yellow/amber pill
- Out of Stock: Red pill
- Paid: Green
- Partial: Amber
- Unpaid: Red

**Navigation (Sidebar):**
- Active item: Left green border `4px`, green text, faint green background
- Inactive: Gray text, no background
- Icons: Lucide React icons

**Metric Cards (Dashboard):**
- Dark card with thin border
- Large mono number in green
- Label below in muted gray
- Optional sparkline in bottom right corner

### 5.6 Responsiveness

| Breakpoint | Behavior |
|------------|----------|
| Desktop (≥1280px) | Full sidebar expanded, multi-column layouts |
| Laptop (1024–1279px) | Sidebar collapsed to icons, content adjusts |
| Tablet (768–1023px) | Sidebar hidden, accessible via hamburger menu |
| Mobile (<768px) | Bottom navigation bar, single-column layout |

> The app is **desktop-primary** (used in shop on laptop) but must be fully functional on mobile for owners checking data on the go.

---

## 6. Application Architecture

### 6.1 Authentication Flow

```
User visits app
  → Not authenticated → /auth/login
  → Authenticated → /dashboard

Login with email + password (Supabase Auth)
  → On success: store session, redirect to /dashboard
  → On fail: show error message

Role check (via user_profiles table):
  → admin → full access
  → staff → restricted access (enforced both client + server side)
```

### 6.2 Data Flow

- All database operations go through **Supabase JS client** or **Next.js Server Actions**
- **Row-Level Security (RLS)** enabled on all Supabase tables
- Staff can only read/insert their own sales; cannot read other tables restricted to admin
- Admin bypasses RLS via service role (server-side only)

---

## 7. Feature Specifications

---

### 7.1 Authentication

**Page:** `/auth/login`

**Fields:**
- Email address
- Password
- "Remember me" checkbox

**Behavior:**
- Login via Supabase Auth (email/password)
- On success: redirect to `/dashboard`
- On fail: display inline error ("Invalid email or password")
- Session persists for 7 days if "Remember me" checked, else session-only
- Forgot password: triggers Supabase password reset email
- No public registration — accounts are created by admin only

**UI Notes:**
- Full-screen dark login page
- Centered card with shop logo/name at top
- "Nisar Khan & Sons" wordmark in Rajdhani font
- Neon green submit button

---

### 7.2 Dashboard (Home)

**Route:** `/dashboard`  
**Access:** Admin (full) | Staff (limited)

#### 7.2.1 Admin Dashboard Widgets

| Widget | Description |
|--------|-------------|
| Today's Sales | Total PKR amount of sales recorded today |
| This Month's Revenue | Total PKR for current calendar month |
| Total Products | Count of active SKUs in inventory |
| Low Stock Alert | Count of products below threshold |
| Recent Sales | Last 5 sales with customer name, amount, time |
| Top Selling Products | Top 5 products by units sold (this month) |
| Sales Chart | Line or bar chart — daily sales for last 30 days |
| Sales by Payment Method | Donut chart (Cash / Card / Bank Transfer) |

#### 7.2.2 Staff Dashboard Widgets

| Widget | Description |
|--------|-------------|
| Today's Sales Count | Number of sales logged today (not PKR amounts) |
| Total Products | Count of products in stock |
| Recent Sales | Last 5 sales (their own only) |
| Quick Action | Button to "Record New Sale" |

> Staff dashboard hides all financial revenue/profit numbers.

---

### 7.3 Inventory Management

**Route:** `/inventory`  
**Access:** Admin (full CRUD) | Staff (read-only)

#### 7.3.1 Product Data Model

Each tile product has the following attributes:

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Auto-generated |
| `sku` | String | Unique product code (e.g., NKS-001) |
| `name` | String | Product name |
| `brand` | String | Manufacturer/brand name |
| `category` | Enum | Floor Tile, Wall Tile, Border Tile, Outdoor Tile, Mosaic |
| `size` | String | e.g., "60x60 cm", "30x60 cm", "12x24 inches" |
| `finish` | Enum | Matte, Glossy, Polished, Textured, Rustic |
| `color` | String | Color name/description |
| `unit` | Enum | Box, Square Meter, Piece |
| `quantity_in_stock` | Integer | Current stock count |
| `low_stock_threshold` | Integer | Alert triggers below this number |
| `cost_price` | Decimal (PKR) | Purchase price (admin only) |
| `selling_price` | Decimal (PKR) | Sale price (visible to staff) |
| `description` | Text | Optional notes |
| `image_url` | String | Optional product image |
| `is_active` | Boolean | Soft delete flag |
| `created_at` | Timestamp | |
| `updated_at` | Timestamp | |

#### 7.3.2 Inventory List Page (`/inventory`)

**Features:**
- Table view of all products with columns: SKU, Name, Brand, Category, Size, Finish, Color, Stock Qty, Selling Price, Status
- Search bar: search by name, SKU, brand, or color
- Filter dropdowns: Category, Brand, Finish, Stock Status (In Stock / Low Stock / Out of Stock)
- Sort by: Name, Stock Qty, Price, Date Added
- Pagination: 25 items per page
- Stock status badge on each row (green/amber/red pill)
- "Add Product" button (admin only) — top right
- Click row → goes to product detail/edit page

**Staff View:** Same table, but no cost price column. Edit/Delete buttons hidden.

#### 7.3.3 Add Product Page (`/inventory/add`)

**Form Fields:**
- SKU (auto-generated suggestion, editable)
- Product Name *
- Brand *
- Category * (dropdown)
- Tile Size * (free text with common size suggestions)
- Finish * (dropdown)
- Color/Description
- Unit of Measure * (dropdown: Box / Sq. Meter / Piece)
- Quantity in Stock *
- Low Stock Threshold * (default: 10)
- Cost Price (PKR) * — admin only field
- Selling Price (PKR) *
- Description / Notes
- Product Image (optional file upload)

**Behavior:**
- All `*` fields are required
- SKU uniqueness validated on submit
- On success: redirect to inventory list with success toast
- Admin-only fields (cost price) hidden from staff entirely

#### 7.3.4 Edit Product Page (`/inventory/[id]`)

- Same form as Add, pre-filled with existing data
- "Update Stock" shortcut: quick +/- quantity adjuster without opening full edit form
- "Deactivate Product" button (soft delete — sets `is_active = false`)
- Full edit history log shown at bottom (who changed what, when)

---

### 7.4 Sales Management

**Route:** `/sales`  
**Access:** Admin (full) | Staff (add + view own)

#### 7.4.1 Sale Record Data Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `sale_number` | String | Auto-generated (e.g., INV-2026-0001) |
| `sale_date` | Date | Default today |
| `customer_name` | String | Required |
| `customer_phone` | String | Optional |
| `payment_method` | Enum | Cash, Bank Transfer, Card, Credit |
| `payment_status` | Enum | Paid, Partial, Unpaid |
| `amount_paid` | Decimal (PKR) | Actual amount received |
| `total_amount` | Decimal (PKR) | Calculated from line items |
| `discount` | Decimal (PKR) | Optional discount |
| `notes` | Text | Optional |
| `created_by` | UUID | User who logged the sale |
| `created_at` | Timestamp | |

#### 7.4.2 Sale Line Items Data Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `sale_id` | UUID | FK → sales |
| `product_id` | UUID | FK → products |
| `product_name` | String | Snapshot at time of sale |
| `quantity` | Integer | |
| `unit_price` | Decimal | Selling price at time of sale |
| `subtotal` | Decimal | quantity × unit_price |

#### 7.4.3 Sales List Page (`/sales`)

**Features:**
- Table: Sale #, Date, Customer Name, Items (count), Total (PKR), Payment Method, Payment Status, Recorded By
- Search: by customer name or sale number
- Filter: by date range, payment method, payment status
- Sort: by date (default newest first), amount
- Pagination: 25 per page
- Click row → sale detail view
- "Record New Sale" button (top right)
- **Admin sees all sales. Staff sees only their own.**

#### 7.4.4 Record New Sale Page (`/sales/add`)

**Form Sections:**

**Section 1 — Customer Info**
- Customer Name * (text input)
- Customer Phone (optional)
- Sale Date * (date picker, defaults to today)
- Notes (optional textarea)

**Section 2 — Items**
- Product search bar: search by name, SKU, or brand
- Click product → adds line item row
- Each line item row shows: Product Name | Size | Unit | Qty (editable) | Unit Price | Subtotal
- Can remove line items
- Must have at least 1 item

**Section 3 — Payment**
- Subtotal (auto-calculated, read-only)
- Discount (optional PKR amount input)
- Total (auto-calculated: subtotal − discount)
- Payment Method * (Cash / Bank Transfer / Card / Credit)
- Payment Status * (Paid / Partial / Unpaid)
- Amount Paid (required if Partial — shows remaining balance)

**Submit Behavior:**
- On save: stock quantity for each product is automatically reduced
- Sale number auto-generated (sequential, e.g., INV-2026-0042)
- Success toast + redirect to sale detail page
- Option to "Print / Export" receipt from the success page

#### 7.4.5 Sale Detail Page (`/sales/[id]`)

- Full view of the sale record
- Formatted like a clean invoice/receipt
- Admin can edit or delete the sale
- "Export as PDF" button

---

### 7.5 Reports & Analytics

**Route:** `/reports`  
**Access:** Admin only

#### 7.5.1 Available Reports

**1. Sales Summary Report**
- Date range selector (today, this week, this month, custom range)
- Total revenue in PKR
- Total number of sales
- Average sale value
- Revenue by payment method (table + donut chart)

**2. Sales by Product Report**
- Table: Product Name | Units Sold | Revenue Generated | % of Total Sales
- Sortable columns
- Filter by date range
- Visual: horizontal bar chart of top 10 products

**3. Inventory Status Report**
- Full list of all products with current stock levels
- Highlights: Out of Stock (red), Low Stock (amber), In Stock (green)
- Filter by category, brand
- Shows cost price, selling price, potential revenue at current stock

**4. Low Stock Report**
- Dedicated view of all products below their low stock threshold
- Columns: SKU, Name, Brand, Category, Stock Qty, Threshold, Selling Price
- "Export" button for this list

**5. Daily Sales Log**
- Date picker → shows all sales for that day
- Summary at top: total sales count, total revenue, breakdown by payment method
- Detailed table of each sale below

#### 7.5.2 Chart Library

All charts use **Recharts** with the dark theme:
- Background: transparent
- Grid lines: `#2A2A2A`
- Line/bar color: `#39FF14` (primary), `#22CC00` (secondary)
- Tooltip: dark card with green border

---

### 7.6 User Management

**Route:** `/users`  
**Access:** Admin only

**Features:**
- List of all user accounts: Name, Email, Role, Status (Active/Inactive), Last Login
- "Add New User" button → form: Full Name, Email, Role (Admin/Staff), Temporary Password
- Edit user: change name, role, active status
- Deactivate user (cannot delete — preserves sales history)
- Reset password: sends reset email via Supabase Auth

**Rules:**
- Admin cannot deactivate themselves
- At least one admin must exist at all times

---

### 7.7 Export & Print

**PDF Export (using jsPDF):**
- Sales Detail / Invoice: formatted receipt with shop name, sale number, date, customer, itemized list, totals, payment method
- Reports: any report page can be exported as a formatted PDF with shop name header and date range
- Styling: dark theme PDF with green accents (or clean white/black PDF for printing — user chooses)

**Excel Export (using SheetJS):**
- Sales list: exports filtered/current view to .xlsx
- Inventory list: full product catalog to .xlsx
- Reports: raw data behind any report as .xlsx

**Export Buttons:**
- Located at top-right of each relevant page/report
- Dropdown: "Export as PDF" / "Export as Excel"

---

## 8. Database Schema

### Tables

```sql
-- Users (extends Supabase auth.users)
user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users,
  full_name   TEXT NOT NULL,
  role        TEXT CHECK (role IN ('admin', 'staff')) NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
)

-- Products / Inventory
products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku                 TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  brand               TEXT,
  category            TEXT CHECK (category IN ('Floor Tile', 'Wall Tile', 'Border Tile', 'Outdoor Tile', 'Mosaic')),
  size                TEXT,
  finish              TEXT CHECK (finish IN ('Matte', 'Glossy', 'Polished', 'Textured', 'Rustic')),
  color               TEXT,
  unit                TEXT CHECK (unit IN ('Box', 'Square Meter', 'Piece')) DEFAULT 'Box',
  quantity_in_stock   INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  cost_price          NUMERIC(12,2),
  selling_price       NUMERIC(12,2) NOT NULL,
  description         TEXT,
  image_url           TEXT,
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
)

-- Sales (header)
sales (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number     TEXT UNIQUE NOT NULL,
  sale_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT,
  payment_method  TEXT CHECK (payment_method IN ('Cash', 'Bank Transfer', 'Card', 'Credit')),
  payment_status  TEXT CHECK (payment_status IN ('Paid', 'Partial', 'Unpaid')),
  subtotal        NUMERIC(12,2) NOT NULL,
  discount        NUMERIC(12,2) DEFAULT 0,
  total_amount    NUMERIC(12,2) NOT NULL,
  amount_paid     NUMERIC(12,2) DEFAULT 0,
  notes           TEXT,
  created_by      UUID REFERENCES user_profiles(id),
  created_at      TIMESTAMPTZ DEFAULT now()
)

-- Sale Line Items
sale_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id       UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id),
  product_name  TEXT NOT NULL,   -- snapshot
  quantity      INTEGER NOT NULL,
  unit_price    NUMERIC(12,2) NOT NULL,
  subtotal      NUMERIC(12,2) NOT NULL
)

-- Product Edit History Log
product_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id),
  changed_by  UUID REFERENCES user_profiles(id),
  change_type TEXT, -- 'stock_update', 'price_change', 'edit', 'created'
  old_value   JSONB,
  new_value   JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
)
```

### Row-Level Security (RLS) Policies

```sql
-- Products: Staff can SELECT only (active products)
-- Sales: Staff can INSERT and SELECT WHERE created_by = auth.uid()
-- Sales: Admin can SELECT/UPDATE/DELETE all
-- user_profiles: Admin can SELECT/UPDATE all; Staff can SELECT own
-- cost_price: Hidden from staff via a database view (products_public_view)
```

---

## 9. Page & Route Map

```
/                           → redirect to /dashboard or /auth/login
/auth/login                 → Login page

/dashboard                  → Main dashboard (admin/staff variant)

/inventory                  → Product list (admin full, staff read-only)
/inventory/add              → Add product form (admin only)
/inventory/[id]             → Product detail / edit (admin edit, staff view)

/sales                      → Sales list (admin all, staff own)
/sales/add                  → Record new sale (admin + staff)
/sales/[id]                 → Sale detail view + export

/reports                    → Reports home (admin only)
/reports/sales-summary      → Sales summary report
/reports/by-product         → Sales by product report
/reports/inventory-status   → Inventory status report
/reports/low-stock          → Low stock report
/reports/daily-log          → Daily sales log

/users                      → User management (admin only)

/settings                   → App settings (admin only)

/unauthorized               → Shown when staff tries to access restricted page
```

---

## 10. Non-Functional Requirements

### Performance
- Dashboard should load in under 2 seconds on a standard laptop browser
- Inventory and sales tables should handle up to 10,000 records without significant slowdown (use pagination and indexed queries)
- All Supabase queries should use indexed columns for filtering (SKU, sale_number, created_by, sale_date)

### Security
- All routes protected by Supabase Auth session middleware (Next.js middleware.ts)
- Role-based access enforced both on the frontend (redirect/hide) AND backend (RLS + server-side checks)
- Cost price field never returned to staff — excluded at database level via a separate view
- Passwords managed entirely by Supabase Auth (never stored in plaintext)
- HTTPS enforced (Vercel default)

### Reliability
- Supabase managed database — backups handled automatically
- Vercel deployment — zero-downtime deploys
- All form submissions show loading states and error handling

### Usability
- Every destructive action (delete, deactivate) requires a confirmation dialog
- Toast notifications for all success and error states
- Empty states (no products, no sales) show helpful onboarding prompts
- All currency values displayed with PKR prefix and comma formatting (e.g., PKR 1,25,000)
- Dates displayed in DD/MM/YYYY format (Pakistan standard)

### Accessibility
- Keyboard navigable forms and tables
- Sufficient color contrast (neon green on dark achieves 7:1+ contrast ratio)
- Focus rings visible on all interactive elements

---

## 11. Out of Scope (v1.0)

The following features are intentionally excluded from the first version and may be considered for future releases:

- Customer khata / credit management (credit tracking per customer)
- Supplier / vendor management
- Purchase orders and restocking workflow
- Multi-branch / multi-location support
- Barcode scanner integration
- SMS or WhatsApp notifications to customers
- Accounting / profit & loss statements
- Mobile app (native iOS/Android)
- Urdu language support
- Online storefront or e-commerce

---

## 12. Open Questions

| # | Question | Priority |
|---|----------|----------|
| 1 | Does the shop have an existing logo to include in the app and on exported PDFs? | High |
| 2 | What is the expected total number of tile products to be entered at launch? | Medium |
| 3 | Should sales records ever be editable after submission, or locked once saved? | High |
| 4 | Is there a specific sale numbering format the shop prefers (e.g., INV-001 vs date-based)? | Low |
| 5 | Should partial/credit sales send any kind of reminder or flag? | Medium |
| 6 | What is the target launch deadline? | High |
| 7 | Will there be an onboarding/data-entry phase to migrate existing records? | Medium |

---

*Document prepared for development use. All specifications are subject to revision based on client feedback.*

*Nisar Khan & Sons — Shop Management System v1.0*
