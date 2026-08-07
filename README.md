# Dental CRM — Enterprise-Grade Clinical Management & Patient Booking Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Engine-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: PolyForm NC 1.0.0](https://img.shields.io/badge/License-PolyForm_NC_1.0.0-red?style=for-the-badge)](./LICENSE)
[![Author](https://img.shields.io/badge/Author-Md%20Sameer%20Sakib-blue?style=for-the-badge&logo=github)](https://github.com/mdsameersakib)

> **Dental CRM** is a full-stack, enterprise-grade clinical management and patient portal platform engineered with Next.js 16 App Router, React 19, Supabase RLS, and Google Gemini AI. Built around a single unified database model, it seamlessly syncs public patient booking workflows with internal staff operations, real-time schedule management, and automated patient portal interaction.

---

## 🚀 Executive Summary & Engineering Highlights

* **Unified Single-Application Architecture**: Eliminates data drift and multi-repo synchronization overhead by powering the public patient discovery portal, patient self-service dashboard, and staff CRM management from a single shared Next.js 16 App Router codebase and unified Supabase data layer.
* **Granular SSR/SSG & Server Action Security**: Employs Next.js 16 Server Actions for safe mutation workflows. All write operations (booking creation, appointment conversion, service updates) execute server-side with strict validation schemas parsed via TypeScript.
* **Row-Level Security (RLS) & Role-Based Isolation**: Database tables are hardened with PostgreSQL Row-Level Security policies. Public users enjoy safe read access to published services and dentists, authenticated patients read only their linked records, while privileged staff operations execute via isolated Supabase Server and Service Role clients.
* **Google Gemini AI Assistant Engine**: Integrates Google Gemini API server-side to provide automated clinical context analysis, smart appointment request parsing, and intelligent schedule optimization recommendations.
* **Full-Stack Type Safety**: End-to-end typing guaranteed through auto-generated Supabase database types (`types/database.ts`), strict TypeScript interfaces, and Biome automated code linting/formatting.
* **Zero Client-Side Secret Exposure**: Key management strictly segregates public anonymous keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) from privileged service-role credentials (`SUPABASE_SERVICE_ROLE_KEY` & `GEMINI_API`), keeping sensitive tokens strictly within node execution contexts.

---

## 🏗️ System Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer
        A[Public Visitors] -->|Browse & Request Bookings| B[Next.js App Router]
        P[Authenticated Patients] -->|Manage Appointments| B
        S[Authenticated Staff] -->|CRM & Schedule Management| B
    end

    subgraph Application & Server Boundary
        B --> C{Route & Role Middleware / Proxy}
        C -->|Public Routes / (public)| D[Server Component SSR / Server Actions]
        C -->|Patient Routes / (patient)| E[Patient Auth & Profile Handler]
        C -->|Staff Routes / (staff)| F[Staff Session & Auth Gate]
        
        D --> G[Public Content Queries]
        E --> H[Patient Portal Mutations]
        F --> I[Admin / Staff Service Actions]
    end

    subgraph Intelligence & Processing Engine
        F -->|Request Context| J[Google Gemini AI Engine]
        J -->|Clinical Insights & Schedule Recs| F
    end

    subgraph Supabase Database & Security Layer
        G -->|Anon Key Read| K[(Supabase PostgreSQL)]
        H -->|Authenticated User Session| K
        I -->|Service Role / Admin Client| K
        
        K --> L[Row Level Security RLS]
        L -->|Policy Check| M[Services & Dentists Tables]
        L -->|Policy Check| N[Booking Requests & Appointments]
        L -->|Policy Check| O[Patient Profiles & Audit Logs]
    end
```

---

## 📱 Platform Walkthrough & Screenshots

### 1. Public Portal & Patient Discovery
| Feature | Technical Highlights | Screenshot Preview |
| :--- | :--- | :---: |
| **Clinic Landing & Hero** | Dynamic SSR content rendering services, emergency announcements, and interactive clinic information directly from Supabase. | ![Landing Page](./public/screenshots/01-landing-page.png) |
| **Services & Dentist Catalog** | Filterable catalog displaying dental specializations, pricing tiers, doctor credentials, and availability. | ![Services & Dentists](./public/screenshots/02-services-dentists.png) |
| **Instant Appointment Request** | Multi-step interactive booking form with real-time field validation and conflict prevention. | ![Patient Booking Request](./public/screenshots/03-patient-booking-modal.png) |

---

### 2. Staff CRM & Clinical Operations
| Feature | Technical Highlights | Screenshot Preview |
| :--- | :--- | :---: |
| **Staff Auth & Gate** | Secure magic-link & password-based staff login with session refresh via Next.js middleware proxy (`proxy.ts`). | ![Staff Auth Login](./public/screenshots/04-staff-auth-login.png) |
| **Dashboard Metrics & KPIs** | Real-time analytics displaying active booking requests, upcoming appointments, and daily revenue stats. | ![Staff Dashboard](./public/screenshots/05-staff-dashboard-metrics.png) |
| **Booking Conversion Flow** | One-click workflow to review patient booking submissions, assign specialist dentists, and convert into confirmed appointments. | ![Appointment Management](./public/screenshots/06-appointment-management.png) |
| **Schedule & Clinic Settings** | Comprehensive CRUD interface for managing dentist working hours, vacation overlays, service rates, and staff invitations. | ![Clinic Settings](./public/screenshots/07-schedule-and-clinic-settings.png) |

---

## 💻 Technology Stack

| Domain | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2.1** (App Router) | Hybrid Server-Side Rendering (SSR), Server Actions, optimized routing & asset delivery. |
| **UI Library** | **React 19.2.4** | Server Components & Client Hooks for ultra-responsive component state management. |
| **Language** | **TypeScript 5.0+** | Strict static typing across database models, server actions, and component props. |
| **Database & Auth** | **Supabase (PostgreSQL)** | Cloud Database, Auth engine, and Row-Level Security (RLS) data protection. |
| **Styling & Design** | **Tailwind CSS v4 & PostCSS** | Modern utility-first responsive styling with clean dark-mode support. |
| **AI Integration** | **Google Gemini AI API** | Intelligent clinical schedule analysis and automated patient request insights. |
| **Code Quality** | **Biome 2.2.0** | Ultra-fast Rust-based linter and code formatter. |
| **Package Manager** | **pnpm 11.20.0** | High-performance deterministic workspace dependency management. |

---

## 🔒 Security & Database Design

### Row-Level Security (RLS) Policies
All core tables in Supabase enforce PostgreSQL RLS policies to guarantee data security:

1. **`services` & `dentists`**: Public `SELECT` allowed for active records; `INSERT`/`UPDATE`/`DELETE` restricted exclusively to authenticated staff users.
2. **`booking_requests`**: Public `INSERT` permitted (with email validation); `SELECT` and `UPDATE` restricted strictly to staff users.
3. **`appointments`**: Read/Write restricted to authenticated staff and the specific assigned patient record.
4. **`patient_profiles`**: Authenticated patients access only their own linked records (`auth.uid() = user_id`).

### Server-Side Secret Handling
- **Client Supabase Instance**: Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` limited strictly by RLS policies.
- **Server Actions & API Routes**: Instantiates Supabase SSR server client (`lib/supabase/server.ts`) maintaining user session cookies.
- **Administrative Workflows**: Uses isolated Service Role client (`lib/supabase/admin.ts`) executing only in safe server-side Node environments for administrative tasks such as staff onboarding invitations.

---

## 🛠️ Local Development & Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v10.0.0` or higher (`npm i -g pnpm`)
- **Supabase Account**: A active Supabase project with database & auth configured.

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mdsameersakib/dental-crm-private.git
   cd dental-crm-private
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Copy the `.env.example` template to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your project keys in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   GEMINI_API=your-gemini-api-key
   ```

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Code Formatting & Linting**
   ```bash
   pnpm lint
   pnpm format
   ```

---

## 📄 License & Anti-Commercial Policy

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

### Key Guidelines & Commercial Restrictions:
* 🟢 **Educational & Portfolio Use Allowed**: You are welcome to review, inspect, and evaluate this codebase for personal learning, code review, and hiring/evaluation purposes.
* 🔴 **No Commercial Use**: You may **NOT** use, copy, modify, distribute, or incorporate this software (in whole or in part) for any commercial enterprise, paid SaaS service, or monetary gain.
* 🔴 **No Resale or Redistribution**: Reselling, sublicensing, or distributing this codebase on marketplaces or repositories is strictly prohibited.

For complete license terms, refer to the [LICENSE](./LICENSE) file.

---

<p center="true" align="center">
  Crafted with ❤️ by <strong>Md Sameer Sakib</strong> • <a href="https://github.com/mdsameersakib">GitHub (@mdsameersakib)</a>
</p>
