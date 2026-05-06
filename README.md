## 1. Project Overview

This project is a **Dental CRM** built as a **single Next.js application**. It currently focuses on two active product surfaces:

1. **Public website**
2. **Staff CRM**

There is also an **auth surface** used for staff login, onboarding, and password recovery.

The system is designed around one central idea:

> staff manages clinic data in one place, and the public website reads from that same source of truth.

That means:

- services are stored in the database
- dentists are stored in the database
- clinic contact information is stored in the database
- booking requests are submitted into the database
- staff reviews those requests and converts them into appointments

So instead of building separate disconnected apps, the project uses one shared backend and one shared data model.

---

## 2. Current Functional Scope

### Public side

The public side allows visitors to:

- see the clinic landing page
- browse services
- browse dentists
- view dentist details
- submit a booking request

### Staff side

The staff side allows authenticated staff users to:

- manage services
- manage dentists
- manage dentist schedules
- edit landing/contact content
- review booking requests
- convert booking requests into appointments
- manage staff access and clinic settings

### Deferred scope

The patient portal was intentionally removed from the active scaffold for now. The database still supports future patient-facing features, but the UI is not currently part of the active implementation.

That is a good academic scope decision, because it keeps the current submission smaller and more stable.

---

## 3. Technology Stack

## 3.1 Next.js 16

The project uses **Next.js 16**.

Why Next.js:

- it gives routing out of the box
- it supports both server-rendered and client-rendered React
- it supports server actions
- it works well with Supabase
- it is a good fit for a project that has both public pages and authenticated internal pages

---

## 3.2 React 19

The UI is built with **React 19**.

Why React:

- component-based UI is ideal for repeated card, form, and layout patterns
- it works naturally with Next.js
- it makes it easier to split pages into reusable sections

---

## 3.3 TypeScript

The project uses **TypeScript**.

Why TypeScript:

- safer refactoring
- better editor help
- fewer mistakes with database shapes and form data
- easier to explain the project because types document intent

---

## 3.4 Tailwind CSS v4

The project uses **Tailwind CSS v4** for styling.

Why Tailwind:

- fast UI iteration
- consistent spacing, colors, sizing, and layout
- no need to create many separate CSS files
- easy to build responsive layouts quickly

---

## 3.5 Biome

The repo uses **Biome** for linting and formatting.

Why Biome:

- fast
- simple setup
- one tool for formatting and code-quality checks

Scripts:

- `pnpm lint` -> `biome check`
- `pnpm format` -> `biome format --write`

This is simpler than having separate ESLint + Prettier setups.

---

## 3.6 Supabase

The backend uses **Supabase** for:

- authentication
- PostgreSQL database
- storage buckets
- row-level security

Why Supabase:

- good fit for full-stack CRUD apps
- PostgreSQL is powerful and industry-standard
- auth is already integrated
- storage is easy for dentist/service images
- works well with Next.js server-side flows

---

## 4. High-Level Architecture

The project was refactored to follow this structure:

- `app/*` = route pages and page composition
- `components/*` = reusable UI components
- `features/*` = business logic grouped by domain
- `lib/*` = infrastructure and low-level helpers
- `supabase/*` = database migrations and seed data
- `types/*` = generated or shared types

---

## 5. Top-Level Folder Walkthrough

## 5.1 `app/`

This is the main routing layer because the project uses **Next.js App Router**.

Important subfolders:

- `app/(public)` -> public pages
- `app/(staff)` -> staff pages
- `app/auth` -> auth pages and auth callback routes
- `app/layout.tsx` -> root HTML layout
- `app/globals.css` -> global styling

Think of `app/` as:

> the place that answers “which URL loads which page?”

---

## 5.2 `components/`

This folder contains reusable UI components.

Subfolders:

- `components/public`
- `components/staff`
- `components/auth`
- `components/ui`

Think of `components/` as:

> reusable visual building blocks

These components should mainly render UI and receive data through props. They should not usually contain deep business logic.

---

## 5.3 `features/`

This is the business/domain layer.

Subfolders:

- `features/bookings`
- `features/dentists`
- `features/services`
- `features/public-content`
- `features/settings`
- `features/staff`

Think of `features/` as:

> the part that knows how the product works

Examples:

- how to validate a service form
- how to fetch public dentist data
- how to convert a booking request into appointment options
- how to check role rules

This is one of the strongest structural decisions in the repo.

---

## 5.4 `lib/`

This is the infrastructure layer.

Subfolders:

- `lib/supabase`
- `lib/auth`

Think of `lib/` as:

> low-level helpers that support the whole app

Examples:

- creating server or admin Supabase clients
- resolving environment variables
- reading the current logged-in user profile

This layer should not become a random dumping ground for app logic. That is why many domain-specific things were moved out into `features/*`.

---

## 5.5 `supabase/`

This folder contains database-related files.

Subfolders/files:

- `supabase/migrations/*`
- `supabase/seed.sql`

Think of this as:

> the history of the database structure

This is important in viva because it shows the project has a real schema, not just frontend mock data.

---

## 5.6 `types/`

This contains shared types, especially generated database types.

Key file:

- `types/database.ts`

This file gives typed knowledge of Supabase tables, enums, and columns, which improves safety across the repo.

---

## 6. Route Surfaces

There are **3 active surfaces** right now:

1. `app/(public)`
2. `app/(staff)`
3. `app/auth`

This is the best mental model to use in viva.

If someone asks:

> Where is the UI?

Start from `app/`.

---

## 7. Public Surface Walkthrough

Folder:

- `app/(public)`

Purpose:

- show clinic information
- show services
- show dentists
- allow appointment request submission

### Files

#### `app/(public)/layout.tsx`

This defines the public-site layout wrapper.

It works together with:

- `components/public/public-site-shell.tsx`

That shell contains the public navbar/footer and general public-site framing.

#### `app/(public)/page.tsx`

This is the landing page route.

It is intentionally thinner now than before. It composes landing page sections instead of doing everything inline.

Related section components:

- `components/public/landing/landing-hero-section.tsx`
- `components/public/landing/landing-trust-highlights-section.tsx`
- `components/public/landing/landing-featured-services-section.tsx`
- `components/public/landing/landing-featured-dentists-section.tsx`
- `components/public/landing/landing-contact-section.tsx`

Why this split is good:

- each section is easier to edit
- less scrolling in one giant page file
- easier to explain and debug

#### `app/(public)/services/page.tsx`

This shows the public services listing page.

It reads published services and renders service cards for visitors.

#### `app/(public)/dentists/page.tsx`

This shows the public dentists listing page.

It renders dentists, filtering UI, and links to dentist details.

#### `app/(public)/dentists/[dentistId]/page.tsx`

This is the public dentist detail page.

It shows an individual dentist’s details, specializations, schedule information, and booking entry points.

#### `app/(public)/book/page.tsx`

This is the public booking request page.

It is one of the most important pages in the project because it connects the public site with the staff CRM.

Supporting files:

- `app/(public)/book/actions.ts`
- `app/(public)/book/service-select.tsx`
- `app/(public)/book/simple-select.tsx`
- `components/public/booking/*`

What happens here:

- the page loads available services and dentists
- the user fills in a booking request form
- the server action validates the input
- a row is inserted into `booking_requests`

This is not direct appointment booking. It is a **request flow**, which is simpler and safer for MVP scope.

---

## 8. Staff Surface Walkthrough

Folder:

- `app/(staff)`

Purpose:

- manage the operational side of the clinic
- maintain public-facing content
- process booking requests
- manage appointments

### Layout and auth gate

#### `app/(staff)/layout.tsx`

This protects the staff area and wraps it in the staff shell.

It works with:

- `lib/auth/session.ts`
- `components/staff/staff-shell.tsx`

So the staff area is not just visually separate, it is access-controlled.

### Staff pages

#### `app/(staff)/staff/services/page.tsx`

Staff services list page.

Purpose:

- show service cards
- provide entry to add/edit/delete services

Related:

- `app/(staff)/staff/services/new/page.tsx`
- `app/(staff)/staff/services/[serviceId]/page.tsx`
- `app/(staff)/staff/services/service-form.tsx`
- `app/(staff)/staff/services/actions.ts`

#### `app/(staff)/staff/dentists/page.tsx`

Staff dentists list page.

Purpose:

- show dentist cards
- show availability summary
- provide entry to add/edit dentists

Related:

- `app/(staff)/staff/dentists/new/page.tsx`
- `app/(staff)/staff/dentists/[dentistId]/page.tsx`
- `app/(staff)/staff/dentists/dentist-form.tsx`
- `app/(staff)/staff/dentists/actions.ts`

#### `app/(staff)/staff/booking-requests/page.tsx`

Shows incoming public booking requests.

This page is operationally important because it is the bridge between public demand and staff scheduling.

Related:

- `app/(staff)/staff/booking-requests/[requestId]/page.tsx`
- `app/(staff)/staff/booking-requests/actions.ts`
- `app/(staff)/staff/booking-requests/[requestId]/convert-appointment-form.tsx`

#### `app/(staff)/staff/appointments/page.tsx`

Shows created appointments and allows status updates.

#### `app/(staff)/staff/landing-content/page.tsx`

This allows staff to edit the public clinic contact information.

The project intentionally trimmed this scope:

- most landing page content is static in code
- only clinic contact information is staff-editable from the database

That is a good scope-control decision.

#### `app/(staff)/staff/settings/page.tsx`

This page contains:

- personal profile info
- password-related actions
- booking defaults / clinic settings
- staff access management

Supporting components:

- `components/staff/settings/my-profile-card.tsx`
- `components/staff/settings/password-card.tsx`
- `components/staff/settings/booking-defaults-card.tsx`
- `components/staff/settings/staff-access-card.tsx`

---

## 9. Auth Surface Walkthrough

Folder:

- `app/auth`

Purpose:

- sign in staff users
- handle onboarding
- handle password reset
- complete Supabase auth redirects

Key files:

- `app/auth/login/page.tsx`
- `app/auth/forgot-password/page.tsx`
- `app/auth/reset-password/page.tsx`
- `app/auth/staff-onboarding/page.tsx`
- `app/auth/actions.ts`
- `app/auth/callback/route.ts`
- `app/auth/confirm/route.ts`

Why auth is its own surface:

- it keeps auth concerns separate from public and staff app concerns
- easier to reason about login flow
- easier to manage redirects and onboarding rules

Supporting auth UI:

- `components/auth/password-field.tsx`
- `components/auth/auth-status-banner.tsx`
- `components/auth/auth-fragment-bridge.tsx`
- `components/ui/auth-layout.tsx`

---

## 10. Components Folder Detailed Walkthrough

## 10.1 `components/public`

Purpose:

- reusable UI for the public website

Important files:

- `public-site-shell.tsx` -> shared public wrapper, navigation, footer
- `landing-interactive.tsx` -> interactive FAQ or related landing behavior
- `booking/*` -> booking page-specific UI sections
- `landing/*` -> landing page sections

Why this folder exists:

- avoids giant route files
- makes UI pieces reusable and easier to test mentally

---

## 10.2 `components/staff`

Purpose:

- reusable UI for the staff CRM

Important files:

- `staff-shell.tsx` -> sidebar, staff navigation frame
- `flash-banner.tsx` -> shared message/status banner
- `services/*` -> service form and card sections
- `dentists/*` -> dentist form, image, schedule, card sections
- `settings/*` -> settings page cards

Why this is better than one huge staff page per feature:

- the page file becomes composition-only
- cards and form sections are easier to update independently
- the code reads more like a real product and less like a prototype

---

## 10.3 `components/auth`

Purpose:

- auth-specific UI helpers

Examples:

- password show/hide field
- auth feedback status messages
- bridging auth redirects/fragments

---

## 10.4 `components/ui`

Purpose:

- small generic UI helpers shared across surfaces

Examples:

- `auth-layout.tsx`
- `confirm-submit-button.tsx`

These are not business-domain components. They are general UI utilities.

---

## 11. Features Folder Detailed Walkthrough

This is the most important folder to understand after `app/`.

Why:

- it contains the business logic
- it is the best place to look when behavior needs to change

---

## 11.1 `features/public-content`

Purpose:

- supply public-facing data in UI-friendly form

Files:

- `queries.ts`
- `landing-queries.ts`
- `service-queries.ts`
- `dentist-queries.ts`
- `mappers.ts`
- `types.ts`
- `constants.ts`
- `presentation.ts`
- `admin.ts`

### What each file does

#### `queries.ts`

Thin composition layer for public content access.

Why this exists:

- public pages can import from one place
- internal query files stay split by domain

#### `landing-queries.ts`

Reads landing-related data, mainly clinic contact/settings.

#### `service-queries.ts`

Reads public service data from the database.

#### `dentist-queries.ts`

Reads public dentist list/detail data and schedule-related public content.

#### `mappers.ts`

Transforms raw database rows into UI-ready objects.

This is important because:

- database rows are not always the same shape you want in the UI
- mapping keeps formatting logic out of route files

#### `admin.ts`

Write-side helper for staff-editable public content.

#### `presentation.ts`

Contains constants and display-friendly configuration for public presentation.

### Why this split is good

Before refactor, public-content logic was more mixed. Now:

- landing logic stays with landing
- service logic stays with services
- dentist logic stays with dentists
- row mapping is centralized

That is better for readability and future maintenance.

---

## 11.2 `features/services`

Purpose:

- all service business logic for the staff/public system

Files:

- `admin.ts`
- `validation.ts`
- `storage.ts`
- `presentation.ts`

### What each file does

#### `admin.ts`

Contains service-related read/write helpers for the staff side.

This usually includes:

- loading service records
- preparing service data for staff pages
- supporting CRUD behavior

#### `validation.ts`

Contains service form validation.

Why this matters:

- validation should not be duplicated across UI and actions
- rules are easier to update in one place

#### `storage.ts`

Handles service image upload/remove behavior through Supabase storage.

This is better than storing image URLs manually, because:

- the app owns the assets
- staff uploads actual files
- storage remains centralized

#### `presentation.ts`

Contains service icon/presentation helpers.

---

## 11.3 `features/dentists`

Purpose:

- dentist CRUD, validation, and image handling

Files:

- `admin.ts`
- `validation.ts`
- `storage.ts`

### What each file does

#### `admin.ts`

Dentist read/write helpers for staff workflows.

This includes logic for:

- loading dentists
- loading dentist details
- saving dentist profile information
- handling schedules in the broader dentist feature flow

#### `validation.ts`

Dentist form validation rules.

#### `storage.ts`

Dentist image upload/remove logic using Supabase storage.

This is important because dentist profile images are now first-class app assets rather than plain external links.

---

## 11.4 `features/bookings`

Purpose:

- booking requests
- appointment data
- conversion logic
- validation
- presentation helpers

Files:

- `admin.ts`
- `request-queries.ts`
- `appointment-queries.ts`
- `lookups.ts`
- `mutations.ts`
- `validation.ts`
- `presentation.ts`
- `public-form.ts`
- `staff-actions.ts`
- `types.ts`
- `convert-appointment.ts`
- `convert-appointment-availability.ts`
- `convert-appointment-time.ts`
- `convert-appointment-types.ts`

### Why this feature matters

This is one of the strongest real CRM parts of the app. It connects:

- public request creation
- staff request review
- appointment creation
- availability logic

### What each file does

#### `mutations.ts`

Write-side booking logic, such as inserting public booking requests.

#### `validation.ts`

Validation rules for booking input.

#### `request-queries.ts`

Queries for staff-facing booking request pages.

#### `appointment-queries.ts`

Queries for appointment pages.

#### `lookups.ts`

Shared lookup helpers, usually for related names, IDs, labels, and supporting query joins.

#### `presentation.ts`

Display-oriented helpers for status labels, colors, formatting, and derived display values.

#### `public-form.ts`

Public booking form-specific constants and derived behavior.

#### `staff-actions.ts`

Shared helpers for server actions in the staff booking flows, such as redirect shaping and shared parsing helpers.

#### `convert-appointment.ts`

Thin export layer for conversion logic.

#### `convert-appointment-availability.ts`

Availability logic for deciding which dentists or time slots are valid.

#### `convert-appointment-time.ts`

Time/date helpers used during appointment conversion.

#### `convert-appointment-types.ts`

Types used by the conversion flow.

This split is useful because the conversion flow is one domain, but it still has separable concerns:

- types
- time math
- availability rules

That is better than having one large mixed file.

---

## 11.5 `features/settings`

Purpose:

- staff settings and clinic settings logic

Key file:

- `features/settings/admin.ts`

This supports the settings page and related staff administration concerns.

---

## 11.6 `features/staff`

Purpose:

- cross-cutting staff concerns

Files:

- `navigation.ts`
- `roles.ts`

### `navigation.ts`

Defines staff sidebar/navigation configuration.

If someone asks:

> where do I change sidebar items?

This is the file.

### `roles.ts`

Defines staff role/access helper logic.

This is important because role rules should be centralized, not repeated across many files.

---

## 12. Infrastructure Layer Walkthrough

## 12.1 `lib/supabase`

This is the backend access infrastructure.

Files:

- `server.ts`
- `admin.ts`
- `client.ts`
- `env.ts`
- `proxy.ts`
- `url.ts`

### What each file does

#### `server.ts`

Creates the Supabase server-side client.

Use this in:

- server components
- server actions
- protected route logic

#### `admin.ts`

Creates the Supabase admin client.

This is used when the app needs elevated backend access, such as staff account management flows.

#### `client.ts`

Browser-side Supabase client.

#### `env.ts`

Centralized environment-variable resolution.

This is better than reading env vars everywhere manually.

#### `proxy.ts`

Helps handle auth cookie/session refresh behavior.

#### `url.ts`

Shared helper for generating correct app URLs used in auth flows and redirects.

---

## 12.2 `lib/auth`

Main file:

- `lib/auth/session.ts`

This is one of the most important security-related files in the repo.

### What it does

- gets current authenticated user
- loads the corresponding `profiles` row
- checks role
- checks active status
- checks onboarding state
- redirects if access is not allowed

Important exported functions:

- `getCurrentProfile()`
- `requireStaffProfile()`
- `requireLandingManagerProfile()`
- `requireAdminProfile()`
- `requireStaffProfileForOnboarding()`

This gives a clear separation:

- **authentication** = who the user is
- **authorization** = what the user is allowed to do

That is a good thing to mention in viva.

---

## 13. Database Layer Walkthrough

Folder:

- `supabase/`

Important files:

- `supabase/migrations/20260325_190000_init_dental_crm.sql`
- `supabase/migrations/20260325_191500_harden_rls_and_indexes.sql`
- `supabase/migrations/20260325_192000_fix_dentist_profile_policy.sql`
- `supabase/migrations/20260416_120000_trim_landing_settings_to_contact_only.sql`
- `supabase/migrations/20260418_090000_guest_appointments_email_linking.sql`
- `supabase/migrations/20260418_110000_add_clinic_settings_and_staff_management.sql`
- `supabase/seed.sql`

### Why this matters

This shows the project is not just frontend work. It has a real evolving relational schema.

### Core entities in the schema

- `profiles`
- `patient_profiles`
- `services`
- `dentist_profiles`
- `landing_settings`
- `dentist_schedules`
- `dentist_time_off`
- `booking_requests`
- `appointments`
- `waitlist`
- `treatments`
- `patient_documents`
- `notifications`
- `activity_logs`

### Important design idea

The schema is more mature than the current UI surface.

That is acceptable and even useful. It means the backend was designed with future expansion in mind, while the current implementation intentionally limits scope to what is needed now.

### Why Postgres is a good fit here

Dental clinic data is relational:

- one patient can have many appointments
- one dentist can have many schedules
- one service can be used in many appointments
- one booking request may convert into an appointment

This is naturally modeled in PostgreSQL.

---

## 14. Type Layer

Key file:

- `types/database.ts`

Purpose:

- generated type information from Supabase schema

Why it is useful:

- prevents invalid column assumptions
- makes query results easier to reason about
- reduces mistakes during refactor

In viva, you can say:

> I used generated database types so the frontend and backend-facing code stayed aligned with the schema.

---

## 15. Data Flow Through the System

## 15.1 Public content flow

Flow:

1. public page route loads
2. route calls `features/public-content/queries.ts`
3. query files read from Supabase tables
4. `mappers.ts` converts rows into UI-ready data
5. route passes data into components
6. components render the page

This is a good design because:

- pages stay thin
- data formatting is not mixed into UI
- database access is centralized

---

## 15.2 Booking request flow

Flow:

1. patient visits `/book`
2. form is filled
3. `app/(public)/book/actions.ts` receives submission
4. validation happens through `features/bookings/validation.ts`
5. mutation happens through `features/bookings/mutations.ts`
6. a row is inserted into `booking_requests`
7. staff sees it in `/staff/booking-requests`
8. staff can mark contacted, reject, or convert
9. if converted, an `appointments` row is created

This is one of the clearest end-to-end stories in the project.

---

## 15.3 Staff content management flow

Flow:

1. staff user logs in
2. staff opens a management page, such as services or dentists
3. route loads data through the relevant feature module
4. form submits to a server action
5. validation and storage/database logic run
6. public site later reads that updated data from the same database

This is the “single source of truth” idea in action.

---

## 16. Authentication and Authorization

This is a very good viva topic because many projects confuse these two.

### Authentication

Authentication means:

> who is the user?

This project uses **Supabase Auth** for identity.

### Authorization

Authorization means:

> what is the user allowed to do?

This project uses:

- `profiles.role`
- `profiles.is_active`
- onboarding completion state

to decide what a logged-in person may access.

### Where this logic lives

- `lib/auth/session.ts`
- `features/staff/roles.ts`

This separation is good because:

- auth provider concerns stay with Supabase
- app-specific permission rules stay in project code
