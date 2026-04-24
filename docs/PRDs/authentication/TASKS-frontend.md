# Tasks: Authentication — Frontend

**PRD:** [PRD-authentication.md](./PRD-authentication.md)
**Backend tasks:** [TASKS-backend.md](./TASKS-backend.md)
**Prerequisite:** Backend deployed and `amplify_outputs.json` generated

---

## Phase 1: Amplify Client Setup

### Task 1.1: Configure Amplify Client
- [ ] Create `components/ConfigureAmplify.tsx`:
  ```tsx
  "use client";
  import { Amplify } from "aws-amplify";
  import outputs from "@/amplify_outputs.json";
  Amplify.configure(outputs, { ssr: true });
  export default function ConfigureAmplifyClientSide() { return null; }
  ```
- [ ] Update `app/layout.tsx` — add `<ConfigureAmplifyClientSide />` inside `<body>` before `{children}`
- [ ] Verify app loads without errors

---

## Phase 2: Session Layer

### Task 2.1: Rewrite `lib/session.ts`
Replace localStorage-based auth with Amplify Auth APIs.

**Remove:**
- [ ] `setSession()` — Amplify manages session automatically
- [ ] `getSession()` — replaced by `getAmplifyUser()`
- [ ] `clearSession()` — replaced by `amplifySignOut()`
- [ ] `resolveUser()` — replaced by Amplify user lookup

**Add:**
- [ ] `getAmplifyUser(): Promise<User | null>`
  - Calls `getCurrentUser()` from `aws-amplify/auth`
  - Calls `fetchUserAttributes()` for user details
  - Calls `fetchAuthSession()` → reads `cognito:groups` from `tokens.accessToken.payload`
  - Maps to existing `User` type
- [ ] `getUserProfile(email): Promise<User | null>`
  - Uses Amplify Data client (`generateClient<Schema>()`)
  - Queries User table by email
- [ ] `getDistributorProfile(distributorId): Promise<Distributor | null>`
  - Queries Distributor table by distributorId
- [ ] `amplifySignOut(): Promise<void>`
  - Calls `signOut()` from `aws-amplify/auth`

**Keep unchanged:**
- [ ] `landingPathForRole(role)` — still maps role → dashboard path

### Task 2.2: Rewrite Route Guards (`lib/use-session-guard.ts`)
- [ ] `useSessionGuard()` — use async `getAmplifyUser()` in `useEffect`, redirect to `/login` if no session
- [ ] `useRoleGuard(role)` — use async `getAmplifyUser()`, check `cognito:groups` from token, redirect if wrong role
- [ ] `useRedirectIfAuthed()` — use async `getAmplifyUser()`, redirect to dashboard if already logged in
- [ ] `useApprovalGuard()` — for distributor role: fetch Distributor record via `getDistributorProfile()`, check `Distributor.status`, redirect to `/distributor/pending-approval` if PENDING

---

## Phase 3: Login Flow

### Task 3.1: Email OTP Login (`app/login/page.tsx`)

**Replace mock handlers:**
- [ ] `handleSubmit` → call `signIn({ username: email, options: { authFlowType: 'USER_AUTH', preferredChallenge: 'EMAIL_OTP' } })`
- [ ] Check `nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'` → transition to OTP form
- [ ] `handleOtpSubmit` → call `confirmSignIn({ challengeResponse: code })`
- [ ] On `signInStep === 'DONE'` → fetch user profile, route to dashboard

**Error handling:**
- [ ] User not found → show "No account found" error
- [ ] Invalid OTP code → show "Invalid code" error
- [ ] Expired code → show "Code expired, please try again"

**Cleanup:**
- [ ] Remove `import { USERS } from "@/components/mock"`
- [ ] Remove `findUserByEmail()` function

### Task 3.2: Social Sign-In (`app/login/page.tsx`)
- [ ] `handleGoogleSignIn` → call `signInWithRedirect({ provider: 'Google' })`
- [ ] `handleAppleSignIn` → call `signInWithRedirect({ provider: 'Apple' })`
- [ ] Handle OAuth callback error (account linking failure, unverified email)

### Task 3.3: Post-Login Routing
After any successful sign-in (OTP or social), determine where to redirect:

- [ ] Fetch User from DynamoDB via `getUserProfile(email)`
- [ ] If no User record (social sign-in, no registration context) → redirect to `/register-distributor`
- [ ] If User exists:
  - [ ] Read role from `cognito:groups` token claim
  - [ ] Admin → `/admin`
  - [ ] Affiliate → `/affiliate`
  - [ ] Distributor → fetch Distributor record:
    - [ ] `Distributor.status === APPROVED` → `/distributor`
    - [ ] `Distributor.status === PENDING` → `/distributor/pending-approval`

---

## Phase 4: Registration Flows

### Task 4.1: Distributor Registration (`app/register-distributor/page.tsx`)

**Email OTP flow:**
- [ ] Validate email does not exist before signUp (query Cognito or show error from `UsernameExistsException`)
- [ ] Form submit → call `signUp({ username: email, options: { userAttributes: { email, given_name, family_name, 'custom:role': 'DISTRIBUTOR' }, autoSignIn: { authFlowType: 'USER_AUTH' } } })`
- [ ] Handle `CONFIRM_SIGN_UP` → transition to OTP verification
- [ ] On `confirmSignUp` → `autoSignIn` → transition to country selection step
- [ ] After country selection → call `createUser` mutation with `role: 'DISTRIBUTOR'`, `countries`
- [ ] On success → redirect to `/distributor/pending-approval`
- [ ] Handle `UsernameExistsException` → show "Email already registered" error

**Social sign-in flow:**
- [ ] Add Google/Apple social sign-in buttons to registration form
- [ ] Before redirect → store context in `localStorage`: `{ origin: 'register-distributor', role: 'DISTRIBUTOR', countries: [...] }`
- [ ] After OAuth callback → check if User exists in DynamoDB:
  - [ ] If no User → call `createUser` mutation with `role: DISTRIBUTOR`, `countries`
  - [ ] Redirect to `/distributor/pending-approval`

### Task 4.2: Affiliate Invite Page (`app/invite/[code]/page.tsx`)
New route for affiliate registration via invite link. Supports invites from both distributors and affiliates.

**Page load:**
- [ ] Read `[code]` param as `inviteCode`
- [ ] Look up User by `inviteCode` (guest auth — `inviteCode` is guest-readable)
- [ ] Validate inviter:
  - [ ] If not found → show error ("Invalid invite link")
  - [ ] Fetch root distributor via `getDistributor(inviter.distributorId)`
  - [ ] If Distributor `status !== APPROVED` → show error ("This invite link is not active")
- [ ] If valid → show registration form (first name, last name, email, country max 1)
- [ ] Display inviter info (name, role) for context

**Email OTP flow:**
- [ ] Form submit → call `signUp` with `custom:role: 'AFFILIATE'`, `custom:inviteCode`
- [ ] OTP verification → `confirmSignUp` → `autoSignIn`
- [ ] Call `createUser` mutation with `role: 'AFFILIATE'`, `inviteCode`, `countries` → `/affiliate`

**Social sign-in flow:**
- [ ] Add Google/Apple buttons
- [ ] Before redirect → store context: `{ origin: 'invite', role: 'AFFILIATE', inviteCode, country }`
- [ ] After callback → call `createUser` mutation with `role: AFFILIATE`, `inviteCode` → `/affiliate`

### Task 4.3: Update Confirmation Page (`app/confirmation/page.tsx`)
Convert from static message to real OTP verification.

- [ ] Accept email and sign-up context (from registration flow via URL params or state)
- [ ] Show OTP input (6-digit code)
- [ ] On submit → call `confirmSignUp({ username: email, confirmationCode: code })`
- [ ] Handle `autoSignIn` flow after confirmation
- [ ] Route to appropriate dashboard

---

## Phase 5: Protected Pages & Logout

### Task 5.1: Pending Approval Page (`app/distributor/pending-approval/page.tsx`)
- [ ] Create new page
- [ ] Show "Your account is pending admin approval" message
- [ ] Show distributor's name and email
- [ ] Include logout button
- [ ] Guard: `useRoleGuard('distributor')` (must be logged in as distributor)

### Task 5.2: Update Distributor Shell (`app/distributor/shell.tsx`)
- [ ] Replace `clearSession()` with `amplifySignOut()`
- [ ] Add `useApprovalGuard()` — checks `Distributor.status`, redirects to `/distributor/pending-approval` if not APPROVED
- [ ] Add "Downline" nav item → `/distributor/downline`
- [ ] Show invite link/code in sidebar or dashboard (only when approved)

### Task 5.3: Update Admin Shell (`app/admin/shell.tsx`)
- [ ] Replace `clearSession()` with `amplifySignOut()`

### Task 5.4: Update Affiliate Shell (`app/affiliate/shell.tsx`)
- [ ] Replace `clearSession()` with `amplifySignOut()`
- [ ] Add "Downline" nav item → `/affiliate/downline`
- [ ] Show invite link/code in sidebar or dashboard

### Task 5.5: Update Root Page (`app/page.tsx`)
- [ ] Replace `getSession()` with async `getAmplifyUser()` check
- [ ] No session → `router.replace('/login')`
- [ ] Has session → `router.replace(landingPathForRole(role))`

---

## Phase 6: Admin Approval UI

### Task 6.1: Admin Approval Page (`app/admin/approval/`)
- [ ] Query Distributor records where `status = PENDING` (using Amplify Data client)
- [ ] Display list: name, email (`ownerEmail`), countries, registration date (`createdAt`)
- [ ] Approve button → call `approveDistributor({ distributorId })` custom mutation (generates inviteCode atomically)
- [ ] Reject button → call `updateDistributor({ distributorId, status: 'REJECTED' })`
- [ ] Show confirmation dialog before action
- [ ] Refresh list after action

### Task 6.2: Downline Tree Page (`app/distributor/downline/page.tsx` + `app/affiliate/downline/page.tsx`)
Org chart diagram showing the user's downline tree.

**Shared component (`components/downline-tree/`):**
- [ ] Install `react-organizational-chart` (or `react-d3-tree`) dependency
- [ ] Create `DownlineTree` component:
  - [ ] Accepts `rootEmail` prop
  - [ ] Calls `getDownlineTree({ rootEmail })` custom query on mount
  - [ ] Builds tree structure from flat array using `parentEmail` references
  - [ ] Renders org chart with boxes and connecting lines
  - [ ] Each node shows: name, email, country, depth, role
  - [ ] Expandable/collapsible subtrees
- [ ] Manual refresh button
- [ ] Total count summary (total affiliates, per-depth breakdown)
- [ ] Search/filter by name

**Distributor page:**
- [ ] `app/distributor/downline/page.tsx` — renders `DownlineTree` with current user's email
- [ ] Guard: `useRoleGuard('distributor')` + `useApprovalGuard()`
- [ ] Shows distributor's own inviteCode and shareable link

**Affiliate page:**
- [ ] `app/affiliate/downline/page.tsx` — renders `DownlineTree` with current user's email
- [ ] Guard: `useRoleGuard('affiliate')`
- [ ] Shows affiliate's own inviteCode and shareable link
- [ ] Tree shows only this affiliate's subtree (not the full distributor network)

---

## Phase 7: Cleanup

### Task 7.1: Remove Mock Auth
- [ ] Remove or deprecate `components/mock.ts` (USERS array)
- [ ] Remove `findUserByEmail()` from login page
- [ ] Clean up any remaining `localStorage` session references (`aim-earn:session`)
- [ ] Remove unused imports (`USERS`, `setSession`, `getSession`, `resolveUser`)

---

## Phase 8: End-to-End Verification

### Functional Tests
- [ ] Distributor registration → OTP → pending → admin approve → dashboard access + inviteCode generated
- [ ] Affiliate invite from distributor → register → OTP → affiliate dashboard (depth 1)
- [ ] Affiliate invite from affiliate → register → OTP → affiliate dashboard (depth 2, parentEmail = affiliate)
- [ ] Multi-level invite chain (3+ levels) → correct depth and parentEmail at each level
- [ ] Invalid invite code (`/invite/badcode`) → error message
- [ ] PENDING distributor has no inviteCode → cannot share invite link
- [ ] Email OTP login → correct dashboard per role
- [ ] Google sign-in → redirect → return → dashboard
- [ ] Apple sign-in → redirect → return → dashboard
- [ ] Duplicate email registration → "Email already registered" error
- [ ] Role guard enforcement — cross-role access blocked
- [ ] Pending distributor login → stuck on approval page
- [ ] Approved distributor login → full dashboard access
- [ ] Logout → session cleared → redirect to login
- [ ] Account linking: register with email → later sign in with Google (same email) → same account
- [ ] Social registration (distributor): Google/Apple on register page → PENDING distributor
- [ ] Social registration (affiliate): Google/Apple on invite page → affiliate linked to inviter
- [ ] Social login (no account): Google/Apple on login page with new email → redirect to register
- [ ] Downline tree (distributor): org chart shows all affiliates in network across all depths
- [ ] Downline tree (affiliate): org chart shows only own sub-tree, not full network
- [ ] Invite from affiliate under rejected distributor → error

### Security Tests
- [ ] Owner cannot update `role`, `distributorId`, `parentEmail`, `depth` via `updateUser`
- [ ] Owner cannot update `status` via `updateDistributor`
- [ ] Guest cannot read bank/payment fields on Distributor
- [ ] Guest can read `status` on Distributor (for invite validation)
- [ ] Guest can read `inviteCode` on User (for invite link validation)
- [ ] Invite link with PENDING distributor chain → rejected

### Build
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes

---

## Files Modified

| File | Change |
|------|--------|
| `components/ConfigureAmplify.tsx` | **New** — Amplify client init |
| `app/layout.tsx` | Add `<ConfigureAmplifyClientSide />` |
| `lib/session.ts` | Replace localStorage with Amplify Auth APIs |
| `lib/use-session-guard.ts` | Async auth checks + `useApprovalGuard()` |
| `app/page.tsx` | Async user check for root redirect |
| `app/login/page.tsx` | Real signIn / confirmSignIn / signInWithRedirect |
| `app/register-distributor/page.tsx` | Real signUp + OTP + social buttons |
| `app/confirmation/page.tsx` | Real OTP `confirmSignUp` |
| `app/invite/[code]/page.tsx` | **New** — affiliate invite registration |
| `app/distributor/pending-approval/page.tsx` | **New** — pending approval page |
| `app/admin/shell.tsx` | Amplify signOut |
| `app/distributor/shell.tsx` | Amplify signOut + approval guard + "Downline" nav |
| `app/affiliate/shell.tsx` | Amplify signOut + "Downline" nav |
| `app/admin/approval/page.tsx` | Wire to `approveDistributor` mutation |
| `app/distributor/downline/page.tsx` | **New** — distributor downline tree page |
| `app/affiliate/downline/page.tsx` | **New** — affiliate downline tree page |
| `components/downline-tree/` | **New** — shared org chart tree component |
