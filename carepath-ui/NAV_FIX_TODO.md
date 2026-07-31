# Nav Buttons Fix - Implementation Steps

## Step 1 - Fix Sidebar.tsx
- [ ] Fix active link detection (exact match → startsWith)
- [ ] Update navItems hrefs to point to direct routes (not redirect pages)
- [ ] Fix roleHome map for coordinator and admin

## Step 2 - Fix DashboardLayout.tsx
- [ ] Synchronize bottomNavItems with sidebar navItems
- [ ] Fix bottom nav hrefs to point to direct routes

## Step 3 - Fix Patient layout (page.tsx redirect pages)
- [ ] Check if any patient nav links need fixing

## Step 4 - Test / Verify
- [ ] Verify all nav links navigate correctly
- [ ] Verify active state highlighting works

