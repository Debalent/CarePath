# Registration Portals - Implementation Progress

## Step 1 ✅ - Login page refactor to use AuthProvider context
- [x] Updated `(auth)/login/page.tsx` to use `useAuth()` hook instead of inline fetch

## Step 2 ✅ - AuthProvider: Ensure ADVOCATE/PARTNER redirects
- [x] Verified `roleRedirect` in `lib/auth.tsx` already includes ADVOCATE and PARTNER
- [x] Login context properly handles all roles (PATIENT, DRIVER, COORDINATOR, ADMIN, ADVOCATE, PARTNER)

## Step 3 ✅ - Registration: Send organization field to backend
- [x] Updated `registerUser` in `services/auth.ts` to include optional `organization` field
- [x] Updated `(dashboard)/register/page.tsx` to pass organization for non-patient roles
- [x] Updated `(dashboard)/register/worker/page.tsx` to pass organization to API
- [x] Updated backend `auth.controller.ts` to accept and destructure `organization` from body

## Step 4 ✅ - Backend: Create profile records on registration
- [x] Auto-create Patient profile on patient registration
- [x] Auto-create Driver profile on driver registration
- [x] Auto-create Coordinator profile on coordinator registration (with organization)
- [x] Auto-create InstitutionalPartner profile on partner registration (with organization)
- [x] Auto-create Advocate profile on advocate registration (with organization)
- [x] Admin role has no profile record (intentional)

## Step 5 ✅ - Clean up registration flow
- [x] `/register` page properly redirects based on role:
  - PATIENT → `/patient/intake` (for profile completion)
  - DRIVER, COORDINATOR, PARTNER, ADVOCATE, ADMIN → `/register/pending` (for admin approval)
