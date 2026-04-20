# Dental CRM - Active Project Map

This map reflects only the currently implemented surfaces after cleanup.

## 1) Route Surfaces

### Public Website
- `/` -> `app/(public)/page.tsx`
- `/services` -> `app/(public)/services/page.tsx`
- `/dentists` -> `app/(public)/dentists/page.tsx`
- `/dentists/[dentistId]` -> `app/(public)/dentists/[dentistId]/page.tsx`
- `/book` -> `app/(public)/book/page.tsx`
- Public layout/shell -> `app/(public)/layout.tsx`, `components/public/public-site-shell.tsx`

### Patient Portal
- `/patient/login` -> `app/patient/login/page.tsx`
- `/patient/dashboard` -> `app/patient/(portal)/dashboard/page.tsx`
- `/patient/appointments` -> `app/patient/(portal)/appointments/page.tsx`
- `/patient/profile` -> `app/patient/(portal)/profile/page.tsx`
- Patient layout/shell -> `app/patient/(portal)/layout.tsx`, `components/patient/patient-shell.tsx`

### Staff CRM
- Staff auth gate/layout -> `app/(staff)/layout.tsx`, `lib/auth/session.ts`
- `/staff/booking-requests` -> `app/(staff)/staff/booking-requests/page.tsx`
- `/staff/booking-requests/[requestId]` (with convert flow) -> `app/(staff)/staff/booking-requests/[requestId]/page.tsx`
- `/staff/appointments` -> `app/(staff)/staff/appointments/page.tsx`
- `/staff/services` -> `app/(staff)/staff/services/page.tsx`
- `/staff/services/new` -> `app/(staff)/staff/services/new/page.tsx`
- `/staff/services/[serviceId]` -> `app/(staff)/staff/services/[serviceId]/page.tsx`
- `/staff/dentists` -> `app/(staff)/staff/dentists/page.tsx`
- `/staff/dentists/new` -> `app/(staff)/staff/dentists/new/page.tsx`
- `/staff/dentists/[dentistId]` -> `app/(staff)/staff/dentists/[dentistId]/page.tsx`
- `/staff/landing-content` -> `app/(staff)/staff/landing-content/page.tsx`
- `/staff/settings` -> `app/(staff)/staff/settings/page.tsx`

### Auth
- `/auth/login` -> `app/auth/login/page.tsx`
- `/auth/forgot-password` -> `app/auth/forgot-password/page.tsx`
- `/auth/reset-password` -> `app/auth/reset-password/page.tsx`
- `/auth/staff-onboarding` -> `app/auth/staff-onboarding/page.tsx`
- Callback/confirm routes -> `app/auth/callback/route.ts`, `app/auth/confirm/route.ts`

## 2) Where Data Comes From

### Public read models
- Main source for public content -> `features/public-content/queries.ts`
- Thin re-export layer used by pages -> `features/public-content/queries.ts`

### Staff CRUD and operations
- Services data + read helpers -> `features/services/admin.ts`
- Services validation -> `features/services/validation.ts`
- Services actions/forms -> `app/(staff)/staff/services/actions.ts`, `app/(staff)/staff/services/service-form.tsx`
- Dentists data + read helpers -> `features/dentists/admin.ts`
- Dentists validation -> `features/dentists/validation.ts`
- Dentists actions/forms -> `app/(staff)/staff/dentists/actions.ts`, `app/(staff)/staff/dentists/dentist-form.tsx`
- Booking/appointment staff reads -> `features/bookings/admin.ts`
- Public booking mutation + validation -> `features/bookings/mutations.ts`, `features/bookings/validation.ts`
- Settings/staff access data -> `features/settings/admin.ts`
- Landing content save helper -> `features/public-content/admin.ts`

### Patient portal reads and actions
- Patient account provisioning/linking -> `features/patient-portal/account.ts`
- Patient dashboard/appointments/profile reads -> `features/patient-portal/queries.ts`
- Patient follow-up request logic -> `features/patient-portal/follow-up.ts`
- Patient profile save helper -> `features/patient-portal/profile.ts`

### Supabase clients and env
- Server client -> `lib/supabase/server.ts`
- Admin client -> `lib/supabase/admin.ts`
- Browser client -> `lib/supabase/client.ts`
- Env resolution -> `lib/supabase/env.ts`
- Session refresh in proxy -> `proxy.ts`, `lib/supabase/proxy.ts`
- DB types -> `types/database.ts`

## 3) Server Actions (write points)

- Public booking submit -> `app/(public)/book/actions.ts`
- Staff booking-request actions -> `app/(staff)/staff/booking-requests/actions.ts`
- Staff appointment status updates -> `app/(staff)/staff/appointments/actions.ts`
- Staff service CRUD -> `app/(staff)/staff/services/actions.ts`
- Staff dentist CRUD/schedule -> `app/(staff)/staff/dentists/actions.ts`
- Staff landing contact save -> `app/(staff)/staff/landing-content/actions.ts`
- Staff settings/invite/toggle/reset -> `app/(staff)/staff/settings/actions.ts`
- Auth actions (sign-in/sign-out/password reset request) -> `app/auth/actions.ts`
- Staff onboarding completion -> `app/auth/staff-onboarding/actions.ts`
- Patient magic-link auth -> `app/patient/actions.ts`
- Patient follow-up request submit -> `app/patient/(portal)/dashboard/actions.ts`
- Patient profile save -> `app/patient/(portal)/profile/actions.ts`

## 4) UI Shell Components

- Public shell/header/footer -> `components/public/public-site-shell.tsx`
- Public FAQ interactive block -> `components/public/landing-interactive.tsx`
- Patient shell/top navigation -> `components/patient/patient-shell.tsx`
- Staff shell/sidebar -> `components/staff/staff-shell.tsx`
- Patient nav config -> `features/patient-portal/navigation.ts`
- Staff nav config -> `features/staff/navigation.ts`
- Auth shell -> `components/ui/auth-layout.tsx`
- Shared confirm button -> `components/ui/confirm-submit-button.tsx`

## 5) Quick Edit Cheatsheet

- Change public hero/services/dentists/contact section UI: `app/(public)/page.tsx`
- Change book page UI or form fields: `app/(public)/book/page.tsx`
- Change booking insert logic: `app/(public)/book/actions.ts`
- Change patient portal UI: `app/patient/(portal)/*`, `components/patient/*`
- Change patient follow-up request logic: `features/patient-portal/follow-up.ts`
- Change patient portal data queries: `features/patient-portal/*`
- Change services card/form behavior in staff: `app/(staff)/staff/services/*`
- Change dentists card/form/schedule behavior in staff: `app/(staff)/staff/dentists/*`
- Change staff account invite/active/reset logic: `app/(staff)/staff/settings/actions.ts`
- Change patient navigation items: `features/patient-portal/navigation.ts`
- Change staff sidebar items: `features/staff/navigation.ts`
