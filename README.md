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
        C -->|Public Routes| D[Server Component SSR / Server Actions]
        C -->|Patient Routes| E[Patient Auth & Profile Handler]
        C -->|Staff Routes| F[Staff Session & Auth Gate]
        
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

### 1. Public Discovery Portal
| Feature | Technical Highlights | Screenshot Preview |
| :--- | :--- | :---: |
| **01. Clinic Landing Page** (`/`) | Dynamic SSR content rendering services, emergency announcements, and interactive clinic hero. | ![Landing Page](./public/screenshots/01-landing-page.png) |
| **02. Services Catalog** (`/services`) | Filterable catalog displaying dental specializations, pricing tiers, and duration. | ![Services Catalog](./public/screenshots/02-services-catalog.png) |
| **03. Dentists Catalog** (`/dentists`) | Specialist doctor directory displaying credentials, experience, and schedules. | ![Dentists Catalog](./public/screenshots/03-dentists-catalog.png) |
| **04. Patient Booking Request** (`/book`) | Interactive multi-step booking form with real-time field validation. | ![Patient Booking](./public/screenshots/04-booking-request.png) |

---

### 2. Staff CRM & Clinical Operations (Sidebar Order)
| Feature | Navigation Path | Technical Highlights | Screenshot Preview |
| :--- | :--- | :--- | :---: |
| **05. Staff Login Gate** | `/auth/login` | Secure staff login with session refresh via Next.js middleware proxy (`proxy.ts`). | ![Staff Login](./public/screenshots/05-staff-login.png) |
| **06. Main Dashboard** | `/staff/dashboard` | Real-time analytics displaying active booking requests, upcoming appointments, and revenue KPIs. | ![Staff Dashboard](./public/screenshots/06-staff-dashboard.png) |
| **07. Booking Requests** | `/staff/booking-requests` | Review patient booking submissions, assign specialist dentists, and convert to appointments. | ![Booking Requests](./public/screenshots/07-staff-booking-requests.png) |
| **08. Appointments** | `/staff/appointments` | Comprehensive appointment calendar, status transitions, and schedule views. | ![Appointments](./public/screenshots/08-staff-appointments.png) |
| **09. Patients Directory** | `/staff/patients` | Unified patient records, contact details, and clinical care history. | ![Patients Directory](./public/screenshots/09-staff-patients.png) |
| **10. Waitlist Queue** | `/staff/waitlist` | Priority waitlist queue management for fast slot re-allocation on cancellations. | ![Waitlist Queue](./public/screenshots/10-staff-waitlist.png) |
| **11. Treatments** | `/staff/treatments` | Active patient treatment management, clinical notes, and procedure tracking. | ![Treatments](./public/screenshots/11-staff-treatments.png) |
| **12. Services Management** | `/staff/services` | Service catalog CRUD interface for managing rates, durations, and images. | ![Services Management](./public/screenshots/12-staff-services.png) |
| **13. Dentists & Schedules** | `/staff/dentists` | Doctor profile management, working hours configuration, and vacation overlays. | ![Dentists & Schedules](./public/screenshots/13-staff-dentists.png) |
| **14. Landing Content** | `/staff/landing-content` | Real-time editor for public website contact info, announcements, and FAQs. | ![Landing Content](./public/screenshots/14-staff-landing-content.png) |
| **15. Workspace Settings** | `/staff/settings` | Clinic profile settings, staff role management, and team onboarding invitations. | ![Workspace Settings](./public/screenshots/15-staff-settings.png) |

---

### 3. Patient Portal & Care Hub
| Feature | Navigation Path | Technical Highlights | Screenshot Preview |
| :--- | :--- | :--- | :---: |
| **16. Patient Dashboard** | `/patient/dashboard` | Patient care hub displaying upcoming visits, reminders, and shared medical documents. | ![Patient Dashboard](./public/screenshots/16-patient-dashboard.png) |
| **17. My Appointments** | `/patient/appointments` | Confirmed appointment schedule and historical treatment visit logs. | ![Patient Appointments](./public/screenshots/17-patient-appointments.png) |
| **18. Patient Profile** | `/patient/profile` | Personal contact information and medical health details management. | ![Patient Profile](./public/screenshots/18-patient-profile.png) |
| **19. AI Clinic Assistant** | `/patient/help` | Google Gemini AI conversational clinical assistant providing care guidance & Q&A. | ![AI Clinic Assistant](./public/screenshots/19-patient-ai-assistant.png) |


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
