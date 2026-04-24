# PRD: Authentication System — Aim Earn Platform

**Status:** Draft
**Date:** 2026-04-23
**Author:** Engineering

---

## 1. Overview

Replace the mock localStorage-based authentication with a production-ready system using **AWS Amplify Gen 2** (Cognito). The system supports three user roles with distinct registration and access flows.

## 2. Goals

- Passwordless login via **Email OTP** (delivered through SendGrid)
- Social sign-in via **Google (Gmail)** and **Apple ID**
- Role-based access for **Distributor**, **Affiliate**, and **Admin**
- Distributor registration with **admin approval** gate
- Affiliate registration via **invite link only** (tied to a distributor)
- Immutable roles — no switching between Distributor ↔ Affiliate after registration
- **Account linking** — social sign-in (Google/Apple) auto-links to existing account if email matches

## 3. User Roles

| Role | Registration | Activation | Group Assignment |
|------|-------------|------------|------------------|
| **Admin** | Manual (AWS Console) | Immediate | Manually added to `ADMIN` Cognito group |
| **Distributor** | Self-registration at `/register-distributor` | Requires admin approval | Auto-added to `DISTRIBUTOR` group on sign-up; status = `PENDING` until approved |
| **Affiliate** | Invite-only via `/invite/{distributorId}` | Immediate | Auto-added to `AFFILIATE` group on sign-up; linked to inviting distributor |

## 4. Authentication Methods

### 4.1 Email OTP (Primary)

- User enters email → receives a 6-digit OTP code via **SendGrid** → enters code → authenticated
- Amplify `signIn` with `authFlowType: 'USER_AUTH'` and `preferredChallenge: 'EMAIL_OTP'`
- Cognito handles OTP generation; a **custom email sender Lambda** intercepts delivery and routes through SendGrid API

### 4.2 Google Sign-In

- "Continue with Gmail" button triggers `signInWithRedirect({ provider: 'Google' })`
- Requires Google OAuth Client ID + Secret stored as Amplify secrets
- Available on **login page**, **distributor registration**, and **affiliate invite page**
- Callback URLs: `/login`, `/register-distributor`, `/invite/*`

### 4.3 Apple Sign-In

- "Continue with Apple ID" button triggers `signInWithRedirect({ provider: 'Apple' })`
- Requires Apple Sign In credentials (Client ID, Key ID, Private Key, Team ID) stored as Amplify secrets
- Available on **login page**, **distributor registration**, and **affiliate invite page**
- Callback URLs: `/login`, `/register-distributor`, `/invite/*`

### 4.4 Account Linking & Social Registration

Social sign-in handles three scenarios, enforced by a **Pre Sign-Up Lambda trigger**:

**Scenario A — Email matches existing account (account linking):**
- User clicks Google/Apple on any page (login or registration)
- Pre Sign-Up Lambda finds existing Cognito user with same email
- Links social identity to existing account via `AdminLinkProviderForUser`
- User signs in as their existing account with all roles/groups intact
- Works from any page — login or registration

**Scenario B — New email on a registration page (social registration):**
- User clicks Google/Apple on `/register-distributor` or `/invite/{code}`
- Before redirect, frontend stores registration context in `localStorage`:
  - `{ origin: 'register-distributor', role: 'DISTRIBUTOR', countries: [...] }` or
  - `{ origin: 'invite', role: 'AFFILIATE', distributorId: '...', country: '...' }`
- Pre Sign-Up Lambda finds no existing user → allows sign-up, sets `autoConfirmUser = true`, `autoVerifyEmail = true`
- After OAuth callback, frontend checks if User exists in DynamoDB:
  - If no User → reads registration context from `localStorage`, calls `createUser` mutation → creates User and assigns Cognito group
  - If User exists → no action (returning user)
- User lands on appropriate dashboard (or pending-approval for distributors)

**Scenario C — New email on login page (no registration context):**
- User clicks Google/Apple on `/login` with an email that has no existing account
- Pre Sign-Up Lambda finds no existing user
- Since no registration context → allows sign-up but user has no role assigned
- After OAuth callback, frontend detects no User → redirects to `/register-distributor` to complete registration (select countries, etc.)

This ensures:
- No duplicate accounts for the same email
- Social sign-in on registration pages works as a full registration alternative to Email OTP
- Social sign-in on login page links to existing accounts or prompts registration
- Distributor approval flow is preserved (social-registered distributors still start as PENDING)

## 5. User Flows

### 5.1 Distributor Registration

```
User visits /register-distributor
  → Option A: Email OTP
      → Fills form (first name, last name, email)
      → Selects countries
      → Amplify signUp (custom:role = DISTRIBUTOR)
      → Receives OTP email via SendGrid
      → Enters OTP code → confirmSignUp
      → `createUser` Lambda:
          - Validates role (DISTRIBUTOR only)
          - Creates User in DynamoDB
          - Creates Distributor record (status: PENDING, generates distributorId)
          - Sets User.distributorId
          - Adds user to DISTRIBUTOR Cognito group
      → Auto sign-in → Redirects to /distributor/pending-approval

  → Option B: Social sign-in (Google / Apple)
      → Selects countries first
      → Frontend stores context: { origin: 'register-distributor', role: 'DISTRIBUTOR', countries }
      → signInWithRedirect → OAuth flow → callback
      → If email already exists → links account (Scenario A)
      → If new email → frontend calls `createUser` mutation → creates User + Distributor (PENDING)
      → Redirects to /distributor/pending-approval

  → Waits for admin approval
  → Admin approves:
      - Updates Distributor.status = APPROVED
  → Admin rejects:
      - Updates Distributor.status = REJECTED
  → Distributor can access full dashboard and share invite link /invite/{inviteCode}
```

### 5.2 Affiliate Registration (Invite from Distributor or Affiliate)

```
Inviter (distributor or affiliate) shares link: /invite/{inviteCode}
  → Page looks up User by inviteCode
  → Validates inviter:
      - Inviter must exist
      - Inviter's root distributor (via distributorId) must have Distributor.status === APPROVED
  → Invalid or unapproved → error message
  → Valid → shows registration form

  → Option A: Email OTP
      → Fills form (first name, last name, email)
      → Selects country (max 1)
      → Amplify signUp (custom:role = AFFILIATE, custom:inviteCode from lookup)
      → Receives OTP email via SendGrid
      → Enters OTP code → confirmSignUp
      → `createUser` Lambda:
          - Validates inviteCode (inviter must exist, root distributor APPROVED)
          - Creates User in DynamoDB:
              parentEmail = inviter.email
              distributorId = inviter.distributorId (inherited)
              depth = inviter.depth + 1
              inviteCode = newly generated
          - Adds user to AFFILIATE Cognito group
      → Auto sign-in → Redirects to /affiliate dashboard

  → Option B: Social sign-in (Google / Apple)
      → Selects country first
      → Frontend stores context: { origin: 'invite', role: 'AFFILIATE', inviteCode, country }
      → signInWithRedirect → OAuth flow → callback
      → If email already exists → links account (Scenario A)
      → If new email → frontend calls `createUser` mutation → creates User (linked to inviter)
      → Redirects to /affiliate dashboard
```

### 5.3 Login (All Roles)

```
User visits /login
  → Enters email
  → Amplify signIn with EMAIL_OTP
  → Receives OTP via SendGrid
  → Enters 6-digit code → confirmSignIn
  → Fetch user profile from DynamoDB
  → Route based on role + status:
      - Admin → /admin
      - Distributor (APPROVED) → /distributor
      - Distributor (PENDING) → /distributor/pending-approval
      - Affiliate → /affiliate

Alternative: Social sign-in
  → Click "Continue with Gmail" or "Continue with Apple ID"
  → signInWithRedirect → OAuth flow → callback to /login
  → Pre Sign-Up Lambda checks email:
      - Email exists in Cognito → links social identity to existing account → session established
      - Email not found → creates new account (no role yet)
  → Frontend checks for User in DynamoDB:
      - User exists → route to dashboard
      - No User → redirect to /register-distributor to complete registration
```

### 5.4 Distributor Approval (Admin)

```
Admin visits /admin/approval
  → Lists Distributor records with status = PENDING
  → Admin clicks Approve:
      - Updates Distributor.status = APPROVED
      - Generates inviteCode for the distributor's User record (random lowercase a-z, min 8 chars)
      - Updates User.inviteCode
  → Admin clicks Reject:
      - Updates Distributor.status = REJECTED
  → Distributor on next login/refresh → full dashboard access + invite link available (if approved)
```

### 5.5 Logout

```
User clicks logout in sidebar
  → Amplify signOut() clears session
  → Redirect to /login
```

## 6. Data Model

### 6.1 Cognito User Pool

- **Primary identifier:** Email
- **Custom attributes:** `custom:role` (set at sign-up, `mutable: false` — prevents users from changing via `updateUserAttributes()`)
- **Groups:** `ADMIN`, `DISTRIBUTOR`, `AFFILIATE` (Cognito groups are the sole source of truth for authorization — `custom:role` is informational only. Cognito automatically populates `cognito:groups` claim in tokens from actual group membership.)
- **Group assignment guarantee:** The `createUser` Lambda always calls `AdminAddUserToGroup` as its final step. A User record is never created without the corresponding Cognito group assignment. If group assignment fails, the Lambda throws an error and the entire operation is rolled back.

### 6.2 DynamoDB — User (via Amplify Data)

| Field | Type | Description |
|-------|------|-------------|
| `email` | String (PK) | User's email, matches Cognito |
| `role` | Enum | `DISTRIBUTOR` / `AFFILIATE` / `ADMIN` |
| `distributorId` | String (nullable) | Root distributor's ID. For distributors: their own Distributor record. For affiliates: inherited from inviter's `distributorId`. Null for admins. |
| `parentEmail` | String (nullable) | Email of the user who invited this user. Null for distributors (they are the root). For affiliates: the inviter's email (could be distributor or another affiliate). |
| `inviteCode` | String (nullable, unique) | Random lowercase a-z, min 8 chars. Used in `/invite/{inviteCode}`. Null for distributors until admin approves. Generated immediately for affiliates on registration. |
| `depth` | Integer | Tree depth level. Distributor = 0, direct invitees = 1, sub-invitees = 2, etc. |
| `firstName` | String | User's first name |
| `lastName` | String | User's last name |
| `countries` | String[] | ISO 3166-1 alpha-2 country codes |

**Relationships (self-referencing):**
```ts
parent: a.belongsTo('User', 'parentEmail')    // my inviter
children: a.hasMany('User', 'parentEmail')    // users I invited
distributor: a.belongsTo('Distributor', 'distributorId')  // root distributor record
```

**Authorization (Amplify built-in field-level auth):**

Model-level: `allow.ownerDefinedIn('email').identityClaim('email')` + `allow.group('ADMIN')`

**Note:** `.identityClaim('email')` is required because the default identity claim is `sub` (UUID). This tells AppSync to match the record's `email` field against the `email` claim in the JWT token.

| Field | Owner | ADMIN | Guest | Notes |
|-------|-------|-------|-------|-------|
| `email` | read | read/update | — | PK, effectively immutable |
| `role` | read | read/update | — | Field-level: owner read + ADMIN |
| `distributorId` | read | read/update | — | Field-level: owner read + ADMIN |
| `parentEmail` | read | read/update | — | Field-level: owner read + ADMIN |
| `inviteCode` | read | read/update | read | Guest needs read for invite link validation |
| `depth` | read | read/update | — | Field-level: owner read + ADMIN |
| `firstName` | read/update | read/update | — | Inherits model-level auth |
| `lastName` | read/update | read/update | — | Inherits model-level auth |
| `countries` | read/update | read/update | — | Inherits model-level auth |

Standard `updateUser` mutation is used — AppSync automatically enforces field-level restrictions. No custom mutation needed.

### 6.3 DynamoDB — Distributor (via Amplify Data)

| Field | Type | Description |
|-------|------|-------------|
| `distributorId` | String (PK) | Random lowercase a-z string (case-insensitive), e.g. "dxkqmz" |
| `ownerEmail` | String | Email of the distributor user (FK to User.email) |
| `status` | Enum | `PENDING` / `APPROVED` / `REJECTED` |
| `firstName` | String | Distributor's first name (from registration form) |
| `lastName` | String | Distributor's last name (from registration form) |
| `countries` | String[] | Requested countries (from registration form) |
| `bankName` | String (nullable) | Bank name (from payment detail form) |
| `bankAccountNumber` | String (nullable) | Bank account number — **field-level auth: owner + ADMIN only** |
| `bankAccountName` | String (nullable) | Account holder name — **field-level auth: owner + ADMIN only** |
| `bankBranch` | String (nullable) | Bank branch — **field-level auth: owner + ADMIN only** |
| `paymentSlipPath` | String (nullable) | S3 path of payment slip image — **field-level auth: owner + ADMIN only** |
| `paymentNotes` | String (nullable) | Additional payment notes |
| `createdAt` | AWSDateTime | Auto-managed timestamp |

**ID generation:** `distributorId` is a random string composed of lowercase `a-z` characters (case-insensitive — stored lowercase, lookups normalize to lowercase). Minimum 8 characters. Generated by the `createUser` Lambda during distributor registration (Distributor record created with `status: PENDING`).

**Authorization (Amplify built-in field-level auth):**

Model-level: `allow.ownerDefinedIn('ownerEmail').identityClaim('email')` + `allow.group('ADMIN')` + `allow.guest().to(['read'])`

**Note:** `.identityClaim('email')` matches `ownerEmail` field against the `email` claim in the JWT token.

| Field | Owner | ADMIN | Guest (public) | Notes |
|-------|-------|-------|----------------|-------|
| `distributorId` | read | read/update | read | PK, effectively immutable |
| `ownerEmail` | — | read/update | — | Field-level: `allow.group('ADMIN')` only |
| `status` | read | read/update | read | Field-level: `allow.ownerDefinedIn('ownerEmail').identityClaim('email').to(['read'])` + `allow.group('ADMIN')` + `allow.guest().to(['read'])` |
| `firstName` | read/update | read/update | read | Inherits model-level auth |
| `lastName` | read/update | read/update | read | Inherits model-level auth |
| `countries` | read/update | read/update | read | Inherits model-level auth |
| `bankName` | read/update | read/update | — | Field-level: `allow.ownerDefinedIn('ownerEmail').identityClaim('email')` + `allow.group('ADMIN')` |
| `bankAccountNumber` | read/update | read/update | — | Field-level: owner + ADMIN only |
| `bankAccountName` | read/update | read/update | — | Field-level: owner + ADMIN only |
| `bankBranch` | read/update | read/update | — | Field-level: owner + ADMIN only |
| `paymentSlipPath` | read/update | read/update | — | Field-level: owner + ADMIN only |
| `paymentNotes` | read/update | read/update | — | Field-level: owner + ADMIN only |
| `createdAt` | read | read | read | Auto-managed, not updatable |

Standard `updateDistributor` mutation is used — AppSync automatically enforces field-level restrictions. No custom mutation needed.

Guest (public) read is safe: field-level auth on `ownerEmail` and all bank/payment fields ensures guests can only see `distributorId`, `status`, `firstName`, `lastName`, `countries`, `createdAt`.
Invite link validation: `/invite/{inviteCode}` → look up User by `inviteCode`, then validate root distributor is APPROVED via `getDistributor(distributorId)`.

**Relationships:**
- A distributor user has exactly one Distributor record (`User.distributorId` = `Distributor.distributorId`)
- A distributor user is the root of a downline tree (`depth = 0`, `parentEmail = null`)
- An affiliate user has a parent (`User.parentEmail` → parent User) and inherits the root distributor (`User.distributorId`)
- Self-referencing: `User.parent` (belongsTo User) and `User.children` (hasMany User via `parentEmail`)
- Invite link: `/invite/{inviteCode}` → look up User by inviteCode → validate root distributor APPROVED → affiliate registers under that user

### 6.4 Downline Tree

The downline tree is a hierarchical structure rooted at each distributor:

```
Distributor (depth 0, parentEmail: null, inviteCode: generated on approval)
├── Affiliate A (depth 1, parentEmail: distributor, inviteCode: generated on registration)
│   ├── Sub-Affiliate A1 (depth 2)
│   └── Sub-Affiliate A2 (depth 2)
│       └── Sub-Sub-Affiliate A2a (depth 3)
└── Affiliate B (depth 1)
```

**Query:** Custom `getDownlineTree` Lambda query — recursively fetches all descendants of a given user using GSI on `parentEmail`. Returns flattened array with tree structure info for frontend rendering.

**Visualization:** Org chart diagram with boxes and connecting lines (using `react-organizational-chart` or similar library).

## 7. Backend Components

### 7.1 `createUser` Custom Mutation (Lambda Handler)

Unified mutation for creating User records — called by both the Post-Confirmation Lambda (email OTP flow) and the frontend (social sign-in flow). Single source of truth for all validation and creation logic.

Defined via `a.handler.function(createUserFn)` in the Amplify Data schema.

**Handler logic (sequential in a single Lambda):**

1. **Role whitelist** — only accept `DISTRIBUTOR` or `AFFILIATE`. Reject `ADMIN` or any other value.
2. **Verify caller** — authenticated user's email must match the `email` argument (prevents impersonation). Skipped for IAM callers (Post-Confirmation Lambda).
3. **Idempotent check** — query User table, reject if User already exists for this email.
4. **For distributors:**
   - Generate `distributorId` (random lowercase a-z, min 8 chars, verify uniqueness)
   - Create Distributor record in DynamoDB (`status: PENDING`)
   - Create User record in DynamoDB (`distributorId` set to new Distributor ID, `parentEmail: null`, `depth: 0`, `inviteCode: null`)
5. **For affiliates:**
   - Look up inviter by `inviteCode` argument
   - Validate inviter exists and root distributor (`inviter.distributorId`) is APPROVED
   - Generate `inviteCode` for new affiliate (random lowercase a-z, min 8 chars, verify uniqueness)
   - Create User record in DynamoDB:
     - `distributorId` = inviter's `distributorId` (inherited)
     - `parentEmail` = inviter's `email`
     - `depth` = inviter's `depth + 1`
     - `inviteCode` = newly generated
6. **Assign Cognito group** — call `AdminAddUserToGroup` (DISTRIBUTOR or AFFILIATE). If this fails, delete the created records and throw error (ensures User + group are always consistent).

**Input:** `email`, `role`, `firstName`, `lastName`, `countries`, `inviteCode` (nullable — required for affiliates, null for distributors)

**Auth:** Authenticated users (user pool) + IAM (for Post-Confirmation Lambda caller)

### 7.1a Post-Confirmation Lambda Trigger (Thin Proxy)

Fires after Cognito confirms a new user (email OTP verified). This Lambda is a **thin proxy** that calls the `createUser` mutation via AppSync IAM auth.

1. Read `custom:role` and other user attributes from the Cognito event
2. Call `createUser` AppSync mutation via IAM, passing: email, role, firstName, lastName, countries, distributorId
3. All validation and group assignment is handled by the `createUser` handler

**Note:** This trigger does NOT fire for social (federated) sign-ins. Social users call `createUser` directly from the frontend (see 7.4).

**Group guarantee:** After this Lambda completes successfully, the user is always in either the `DISTRIBUTOR` or `AFFILIATE` Cognito group. The `cognito:groups` claim will be populated in subsequent token refreshes.

### 7.2 Custom Email Sender Lambda

Intercepts Cognito email events and sends via SendGrid instead of default SES. Handles:
- `CustomEmailSender_SignUp` — verification/confirmation code
- `CustomEmailSender_Authentication` — OTP login code
- `CustomEmailSender_ForgotPassword` — password reset (if needed)

Requires `SENDGRID_API_KEY` stored as Amplify secret.

### 7.3 Pre Sign-Up Lambda Trigger (Account Linking)

Fires before Cognito creates a new user. Handles federated (social) sign-in.

**Security:** Must verify `event.request.userAttributes.email_verified === 'true'` before proceeding. Rejects the sign-up if the social provider has not verified the email (prevents account takeover via unverified email from a Google Workspace or similar).

**Scenario A — Existing account with same email:**
1. Receives social sign-up event (provider = Google or Apple)
2. Verifies `email_verified === 'true'` — rejects if not verified
3. Calls `AdminListUsers` to find existing Cognito user by email
4. If found: calls `AdminLinkProviderForUser` to link the social identity to the existing account
5. Sets `autoConfirmUser = true` and `autoVerifyEmail = true`
6. User signs in as their existing account with all roles/groups intact

**Scenario B — New email (social registration):**
1. Receives social sign-up event
2. Verifies `email_verified === 'true'` — rejects if not verified
3. Calls `AdminListUsers` — no match found
4. Allows the sign-up to proceed (`autoConfirmUser = true`, `autoVerifyEmail = true`)
5. No role/group assigned yet — frontend handles User/Distributor creation after callback via Amplify Data mutation (see 7.4)

This prevents:
- Account takeover via unverified social provider emails
- Duplicate accounts from social providers
- Role/group inconsistencies between email and social identities

### 7.4 Social Profile Setup (Frontend calls `createUser`)

**Architecture note:** `signInWithRedirect()` does not support `clientMetadata`, so a Post-Authentication Lambda cannot receive registration context. Instead, the **frontend** calls the shared `createUser` mutation (see 7.1) after OAuth callback.

**Flow after social OAuth callback:**
1. Frontend checks if User exists in DynamoDB for the authenticated email
2. If User exists → no action (returning user), route to dashboard
3. If no User → frontend reads registration context from `localStorage` (stored before redirect):
   - **From `/register-distributor`**: calls `createUser` mutation with `role: DISTRIBUTOR`, countries
   - **From `/invite/{code}`**: calls `createUser` mutation with `role: AFFILIATE`, `inviteCode`
   - **From `/login` (no context)**: no mutation called, redirect to `/register-distributor`

All security checks (role whitelist, inviteCode validation, caller verification, idempotency) are handled by the shared `createUser` Lambda — same code path as the email OTP flow.

### 7.5 `getDownlineTree` Custom Query (Lambda Handler)

Recursively fetches the entire downline tree for a given user.

**Input:** `rootEmail: String`
**Output:** `[{ email, firstName, lastName, depth, parentEmail, inviteCode, countries, role }]`
**Auth:** Authenticated — owner can query their own downline, admin can query any

**Handler logic:**
1. Fetch the root user
2. Breadth-first traversal: query GSI on `parentEmail` to get all direct children, then their children, etc.
3. Return flattened array with all descendants (frontend builds tree structure from `parentEmail` references)

**GSI required:** `parentEmail` index on User table (auto-created by `a.hasMany('User', 'parentEmail')` relationship, or manually added)

### 7.6 `approveDistributor` Custom Mutation (Lambda Handler)

Atomically approves a distributor and generates their invite code.

**Input:** `distributorId: String`
**Auth:** `allow.group('ADMIN')` only

**Handler logic:**
1. Update `Distributor.status = APPROVED`
2. Generate `inviteCode` for distributor's User record (random lowercase a-z, min 8 chars, verify uniqueness)
3. Update `User.inviteCode`
4. Both updates are atomic — if either fails, rollback

## 8. Frontend Changes

### 8.1 New Files

| File | Purpose |
|------|---------|
| `components/ConfigureAmplify.tsx` | Client-side `Amplify.configure()` with SSR |
| `app/invite/[code]/page.tsx` | Affiliate invite registration page |
| `app/distributor/pending-approval/page.tsx` | "Waiting for approval" page |
| `amplify/auth/post-confirmation/resource.ts` | Post-Confirmation Lambda (thin proxy → calls `createUser` mutation) |
| `amplify/auth/post-confirmation/handler.ts` | Reads Cognito event, calls AppSync `createUser` via IAM |
| `amplify/data/create-user/resource.ts` | `createUser` Lambda handler definition |
| `amplify/data/create-user/handler.ts` | Unified user creation: validation, DynamoDB writes, Cognito group assignment |
| `amplify/auth/custom-email-sender/resource.ts` | SendGrid sender definition |
| `amplify/auth/custom-email-sender/handler.ts` | SendGrid sender handler |
| `amplify/auth/pre-sign-up/resource.ts` | Pre Sign-Up Lambda definition |
| `amplify/auth/pre-sign-up/handler.ts` | Account linking for existing emails, allow new social sign-ups |
| `amplify/data/get-downline-tree/resource.ts` | `getDownlineTree` Lambda definition |
| `amplify/data/get-downline-tree/handler.ts` | Recursive tree query via GSI on parentEmail |
| `amplify/data/approve-distributor/resource.ts` | `approveDistributor` Lambda definition |
| `amplify/data/approve-distributor/handler.ts` | Approve distributor + generate inviteCode |
| `app/distributor/downline/page.tsx` | Distributor downline tree visualization |
| `app/affiliate/downline/page.tsx` | Affiliate downline tree visualization |

### 8.2 Modified Files

| File | Change |
|------|--------|
| `amplify/auth/resource.ts` | Email OTP, Google, Apple, groups, triggers, SendGrid |
| `amplify/data/resource.ts` | Replace Todo with User model |
| `app/layout.tsx` | Add `<ConfigureAmplifyClientSide />` |
| `lib/session.ts` | Replace localStorage with Amplify Auth APIs |
| `lib/use-session-guard.ts` | Async auth checks + approval guard hook |
| `app/login/page.tsx` | Real signIn / confirmSignIn / signInWithRedirect |
| `app/register-distributor/page.tsx` | Real signUp + OTP + social sign-in buttons |
| `app/confirmation/page.tsx` | Real OTP confirmSignUp |
| `app/admin/shell.tsx` | Amplify signOut |
| `app/distributor/shell.tsx` | Amplify signOut + approval guard |
| `app/affiliate/shell.tsx` | Amplify signOut |

## 9. Prerequisites

Before deployment, the following must be ready:

| Secret | Source | Purpose |
|--------|--------|---------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | Google OAuth |
| `SIWA_CLIENT_ID` | Apple Developer Console | Apple Sign In |
| `SIWA_KEY_ID` | Apple Developer Console | Apple Sign In |
| `SIWA_PRIVATE_KEY` | Apple Developer Console | Apple Sign In |
| `SIWA_TEAM_ID` | Apple Developer Console | Apple Sign In |
| `SENDGRID_API_KEY` | SendGrid Dashboard | Email OTP delivery |

Secrets are stored via: `npx ampx sandbox secret set <KEY> --profile amplify-alphie`

## 10. Security Constraints

All backend components enforce the following rules:

1. **Role whitelist:** The `createUser` Lambda only accepts `DISTRIBUTOR` or `AFFILIATE`. The value `ADMIN` is always rejected — admin users are created manually in AWS Console only.
2. **Email verification on account linking:** Pre Sign-Up Lambda verifies `email_verified === 'true'` from the social provider before linking or creating accounts. Prevents account takeover via unverified emails.
3. **Server-side inviteCode validation:** The `createUser` Lambda looks up the inviter by `inviteCode`, then verifies the root Distributor exists and `status === APPROVED` before creating affiliate Users.
4. **Field-level write protection:** User and Distributor models use Amplify built-in field-level authorization. Protected fields (`role`, `distributorId`, `status`, `ownerEmail`) have `allow.group('ADMIN')` only — AppSync rejects owner writes automatically. Standard `updateUser`/`updateDistributor` mutations are used.
5. **Immutable custom attributes:** `custom:role` is set with `mutable: false` in Cognito — users cannot change it via `updateUserAttributes()`.
6. **Cognito groups as authorization source of truth:** Cognito automatically populates `cognito:groups` claim in tokens. `custom:role` is informational only.
7. **Group assignment guarantee:** The `createUser` Lambda always assigns a Cognito group (`DISTRIBUTOR` or `AFFILIATE`) as its final step. If group assignment fails, the entire operation is rolled back. A User record never exists without a corresponding Cognito group.

## 11. Route Map (Post-Implementation)

| Route | Access | Guard |
|-------|--------|-------|
| `/login` | Public | `useRedirectIfAuthed()` |
| `/register-distributor` | Public | `useRedirectIfAuthed()` |
| `/invite/[code]` | Public | `useRedirectIfAuthed()` + validate inviteCode |
| `/confirmation` | Public | — |
| `/admin/*` | Admin only | `useRoleGuard('admin')` |
| `/distributor/pending-approval` | Distributor (PENDING) | `useRoleGuard('distributor')` |
| `/distributor/*` | Distributor (APPROVED) | `useRoleGuard('distributor')` + `useApprovalGuard()` |
| `/affiliate/*` | Affiliate only | `useRoleGuard('affiliate')` |
| `/distributor/downline` | Distributor (APPROVED) | `useRoleGuard('distributor')` + `useApprovalGuard()` |
| `/affiliate/downline` | Affiliate only | `useRoleGuard('affiliate')` |

## 12. Acceptance Criteria

1. **Distributor registration**: form → OTP via SendGrid → verify → pending approval page
2. **Admin approval**: admin sees pending distributors → approve → distributor gets full access + inviteCode generated
3. **Affiliate invite from distributor**: `/invite/{distributorInviteCode}` → register → OTP → affiliate dashboard (linked to distributor, depth 1)
4. **Invalid invite**: `/invite/BAD_CODE` → error message, no registration
5. **Email OTP login**: email → OTP via SendGrid → code → role-appropriate dashboard
6. **Google sign-in**: redirect → Google OAuth → return → dashboard
7. **Apple sign-in**: redirect → Apple OAuth → return → dashboard
8. **Duplicate email**: registration rejects with clear error
9. **Role enforcement**: each role accesses only their own dashboard section
10. **No role switch**: once registered as distributor/affiliate, cannot change
11. **Logout**: clears Amplify session, redirects to `/login`
12. **Pending distributor login**: can log in but stuck on pending approval page
13. **Account linking**: user registers with email OTP → later signs in with Google (same email) → same account, same role
14. **Social registration (distributor)**: click Google/Apple on `/register-distributor` → OAuth → creates account as PENDING distributor
15. **Social registration (affiliate)**: click Google/Apple on `/invite/{code}` → OAuth → creates account as affiliate linked to distributor
16. **Social login (no account)**: click Google/Apple on `/login` with new email → redirects to `/register-distributor` to complete registration
17. **Linked account retains role**: after linking Google/Apple, user keeps original role and group
18. **Affiliate-to-affiliate invite**: affiliate shares own `/invite/{inviteCode}` → sub-affiliate registers → linked under affiliate (depth +1)
19. **Downline tree (distributor)**: org chart shows all affiliates in network, all depths
20. **Downline tree (affiliate)**: org chart shows only own sub-tree
21. **PENDING distributor cannot invite**: no inviteCode until approved
22. **Invite chain validation**: invite from affiliate under rejected distributor → error
