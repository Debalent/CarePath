# CarePath Role-Specific Portals - Implementation TODO

## Step 1 ✅ - Push current changes to GitHub
- [x] Commit and push DashboardLayout/Sidebar changes to staging

## Step 2 - Fix Hamburger Menu Operational
- [x] Already exists in Topbar.tsx and DashboardLayout
- [ ] Verify menu works - it's already implemented with `sidebarOpen` state

## Step 3 - Backend: Add ADVOCATE/PARTNER to DashboardLayout Type
- [ ] Add `advocate` and `partner` to Role type in DashboardLayout.tsx
- [ ] Add `advocate` and `partner` to Role type in Sidebar.tsx

## Step 4 - Advocate Portal Pages
- [ ] Create `(dashboard)/advocate/layout.tsx`
- [ ] Create `(dashboard)/advocate/dashboard/page.tsx`
- [ ] Create `(dashboard)/advocate/rides/page.tsx`
- [ ] Create `(dashboard)/advocate/patients/page.tsx`
- [ ] Create `(dashboard)/advocate/messages/page.tsx`
- [ ] Create `(dashboard)/advocate/profile/page.tsx`

## Step 5 - Partner Portal Pages
- [ ] Create `(dashboard)/partner/layout.tsx`
- [ ] Create `(dashboard)/partner/dashboard/page.tsx`
- [ ] Create `(dashboard)/partner/credits/page.tsx`
- [ ] Create `(dashboard)/partner/rides/page.tsx`
- [ ] Create `(dashboard)/partner/messages/page.tsx`
- [ ] Create `(dashboard)/partner/profile/page.tsx`

## Step 6 - Communication Portal (Shared Component)
- [ ] Create shared `RideMessageThread` component
- [ ] Add `/messages` pages for all roles using the shared component

## Step 7 - Login/Auth Improvements
- [ ] Update login page to use AuthProvider context
- [ ] Add role-specific redirects for ADVOCATE and PARTNER

## Step 8 - Push all changes to GitHub
- [ ] Commit and push all changes

