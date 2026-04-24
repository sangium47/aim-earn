# Tasks: Authentication — Backend

**PRD:** [PRD-authentication.md](./PRD-authentication.md)
**AWS Profile:** `amplify-alphie`

---

## Phase 1: Data Models & Schema

### Task 1.1: User Model (`amplify/data/resource.ts`)
- [ ] Replace Todo model with User schema
- [ ] Fields: `email` (PK), `role`, `distributorId` (nullable), `parentEmail` (nullable), `inviteCode` (nullable, unique), `depth` (integer), `firstName`, `lastName`, `countries`
- [ ] Self-referencing relationships:
  - `parent: a.belongsTo('User', 'parentEmail')` — inviter
  - `children: a.hasMany('User', 'parentEmail')` — invitees (creates GSI on `parentEmail`)
  - `distributor: a.belongsTo('Distributor', 'distributorId')` — root distributor
- [ ] Field-level auth (`.identityClaim('email')` required — default `sub` won't match email string):
  - Model-level: `allow.ownerDefinedIn('email').identityClaim('email')` + `allow.group('ADMIN')`
  - `role`: owner read + ADMIN (owner cannot update)
  - `distributorId`: owner read + ADMIN (owner cannot update)
  - `parentEmail`: owner read + ADMIN (owner cannot update)
  - `inviteCode`: owner read + ADMIN + guest read (guest needs for invite link validation)
  - `depth`: owner read + ADMIN (owner cannot update)
  - `firstName`, `lastName`, `countries`: inherit model-level (owner can read/update)

### Task 1.2: Distributor Model (`amplify/data/resource.ts`)
- [ ] Add Distributor schema
- [ ] Fields: `distributorId` (PK), `ownerEmail`, `status`, `firstName`, `lastName`, `countries`, `bankName`, `bankAccountNumber`, `bankAccountName`, `bankBranch`, `paymentSlipPath`, `paymentNotes`, `createdAt`
- [ ] Field-level auth (`.identityClaim('email')` required — matches `ownerEmail` against JWT `email` claim):
  - Model-level: `allow.ownerDefinedIn('ownerEmail').identityClaim('email')` + `allow.group('ADMIN')` + `allow.guest().to(['read'])`
  - `ownerEmail`: `allow.group('ADMIN')` only
  - `status`: `allow.ownerDefinedIn('ownerEmail').identityClaim('email').to(['read'])` + `allow.group('ADMIN')` + `allow.guest().to(['read'])`
  - `bankName`, `bankAccountNumber`, `bankAccountName`, `bankBranch`, `paymentSlipPath`, `paymentNotes`: `allow.ownerDefinedIn('ownerEmail').identityClaim('email')` + `allow.group('ADMIN')` (hidden from guests)
  - `firstName`, `lastName`, `countries`, `distributorId`, `createdAt`: inherit model-level (guests can read)
- [ ] Invite link validation uses standard `getDistributor` query — guest reads `distributorId`, `status`, `firstName`, `lastName`

---

## Phase 2: Auth Resource Configuration

### Task 2.1: Email OTP + Groups (`amplify/auth/resource.ts`)
- [ ] Set `loginWith.email.otpLogin: true`
- [ ] Add `groups: ['DISTRIBUTOR', 'AFFILIATE', 'ADMIN']`
- [ ] Set `custom:role` attribute with `mutable: false`

### Task 2.2: Social Providers (`amplify/auth/resource.ts`)
- [ ] Add Google provider config with `secret('GOOGLE_CLIENT_ID')`, `secret('GOOGLE_CLIENT_SECRET')`
- [ ] Add Apple Sign In config with `secret('SIWA_CLIENT_ID')`, `secret('SIWA_KEY_ID')`, `secret('SIWA_PRIVATE_KEY')`, `secret('SIWA_TEAM_ID')`
- [ ] Configure `callbackUrls`: `['http://localhost:3000/login', 'https://your-domain.com/login']`
- [ ] Configure `logoutUrls`: `['http://localhost:3000/login', 'https://your-domain.com/login']`

### Task 2.3: Wire Triggers (`amplify/auth/resource.ts`)
- [ ] Wire `postConfirmation` trigger
- [ ] Wire `preSignUp` trigger
- [ ] Wire `senders.email` (SendGrid custom email sender)
- [ ] Configure `access` permissions for triggers

---

## Phase 3: Lambda Functions

### Task 3.1: `createUser` Lambda Handler
Unified mutation for both email OTP (via Post-Confirmation) and social sign-in (via frontend).

**Files:**
- [ ] `amplify/data/create-user/resource.ts` — `defineFunction`
- [ ] `amplify/data/create-user/handler.ts` — handler logic

**Schema wiring (`amplify/data/resource.ts`):**
- [ ] Define `createUser` custom mutation using `a.handler.function(createUserFn)`
- [ ] Arguments: `email`, `role`, `firstName`, `lastName`, `countries`, `inviteCode` (nullable — required for affiliates, null for distributors)
- [ ] Returns: User type
- [ ] Auth: `allow.authenticated()` + `allow.custom()` (IAM for Post-Confirmation Lambda)

**Handler logic (sequential):**
- [ ] 1. **Role whitelist** — only accept `DISTRIBUTOR` or `AFFILIATE`. Reject `ADMIN`.
- [ ] 2. **Verify caller** — authenticated user's email must match `email` arg. Skip for IAM callers.
- [ ] 3. **Idempotent check** — query User table, reject if User already exists.
- [ ] 4. **For distributors:**
  - [ ] Generate `distributorId` (random lowercase a-z, min 8 chars, verify uniqueness)
  - [ ] Create Distributor record in DynamoDB (`status: PENDING`)
  - [ ] Create User record (`distributorId` = new ID, `parentEmail: null`, `depth: 0`, `inviteCode: null`)
- [ ] 5. **For affiliates:**
  - [ ] Look up inviter by `inviteCode` argument
  - [ ] Validate inviter exists and root distributor (`inviter.distributorId`) has `status === APPROVED`
  - [ ] Generate `inviteCode` for new affiliate (random lowercase a-z, min 8 chars, verify uniqueness)
  - [ ] Create User record (`distributorId` = inviter's distributorId, `parentEmail` = inviter's email, `depth` = inviter's depth + 1, `inviteCode` = new code)
- [ ] 6. **Assign Cognito group** — call `AdminAddUserToGroup`. If fails, delete created records and throw (rollback).

**Permissions (`amplify/backend.ts`):**
- [ ] Grant `cognito-idp:AdminAddUserToGroup` via `backend.auth.resources.userPool.grant()`
- [ ] Grant DynamoDB read/write to User and Distributor tables

### Task 3.2: Post-Confirmation Lambda (Thin Proxy)
Fires after email OTP sign-up confirmation. Calls `createUser` via AppSync IAM.

**Files:**
- [ ] `amplify/auth/post-confirmation/resource.ts` — `defineFunction`
- [ ] `amplify/auth/post-confirmation/handler.ts`

**Handler logic:**
- [ ] Read `custom:role` and user attributes from Cognito event
- [ ] Call `createUser` AppSync mutation via IAM auth
- [ ] Pass: `email`, `role`, `firstName`, `lastName`, `countries`, `distributorId`

**Permissions:**
- [ ] Grant IAM access to AppSync API (`backend.data.resources.graphqlApi.grant*()`)

### Task 3.3: Pre Sign-Up Lambda (Account Linking)
Fires before Cognito creates a new user. Handles social sign-in linking/registration.

**Files:**
- [ ] `amplify/auth/pre-sign-up/resource.ts` — `defineFunction`
- [ ] `amplify/auth/pre-sign-up/handler.ts`

**Handler logic:**
- [ ] Detect federated (social) sign-up events
- [ ] **Security:** verify `email_verified === 'true'` from social provider. Reject if not verified.
- [ ] Call `AdminListUsers` to find existing user by email
- [ ] If found → call `AdminLinkProviderForUser` to link social identity, set `autoConfirmUser = true`, `autoVerifyEmail = true`
- [ ] If not found → allow sign-up, set `autoConfirmUser = true`, `autoVerifyEmail = true`
- [ ] For non-federated sign-ups → pass through unchanged

**Permissions:**
- [ ] Grant `listUsers` and `linkProviderForUser` via `access` in auth resource

### Task 3.4: Custom Email Sender Lambda (SendGrid)
Intercepts Cognito email events and sends via SendGrid API.

**Files:**
- [ ] `amplify/auth/custom-email-sender/resource.ts` — `defineFunction` with `SENDGRID_API_KEY` secret
- [ ] `amplify/auth/custom-email-sender/handler.ts`

**Handler logic:**
- [ ] Handle `CustomEmailSender_SignUp` — verification/confirmation code
- [ ] Handle `CustomEmailSender_Authentication` — OTP login code
- [ ] Handle `CustomEmailSender_ForgotPassword` — password reset (if needed)
- [ ] Use `@sendgrid/mail` package

### Task 3.5: `getDownlineTree` Custom Query (Lambda Handler)
Recursively fetches the downline tree for a given user.

**Files:**
- [ ] `amplify/data/get-downline-tree/resource.ts` — `defineFunction`
- [ ] `amplify/data/get-downline-tree/handler.ts`

**Schema wiring:**
- [ ] Define `getDownlineTree` custom query in `amplify/data/resource.ts`
- [ ] Arguments: `rootEmail: String`
- [ ] Returns: array of `{ email, firstName, lastName, depth, parentEmail, inviteCode, countries, role }`
- [ ] Auth: `allow.authenticated()`

**Handler logic:**
- [ ] Fetch root user by email
- [ ] Verify caller is the root user or an admin (security)
- [ ] Breadth-first traversal via GSI on `parentEmail`: get children → get their children → etc.
- [ ] Return flattened array of all descendants

**Permissions:**
- [ ] Grant DynamoDB read access to User table

### Task 3.6: `approveDistributor` Custom Mutation (Lambda Handler)
Atomically approves a distributor and generates their invite code.

**Files:**
- [ ] `amplify/data/approve-distributor/resource.ts` — `defineFunction`
- [ ] `amplify/data/approve-distributor/handler.ts`

**Schema wiring:**
- [ ] Define `approveDistributor` custom mutation in `amplify/data/resource.ts`
- [ ] Arguments: `distributorId: String`
- [ ] Returns: Distributor type
- [ ] Auth: `allow.group('ADMIN')` only

**Handler logic:**
- [ ] Validate Distributor exists and `status === PENDING`
- [ ] Update `Distributor.status = APPROVED`
- [ ] Generate `inviteCode` for distributor's User record (random lowercase a-z, min 8 chars, verify uniqueness)
- [ ] Update `User.inviteCode`
- [ ] Both updates atomic — if either fails, rollback

**Permissions:**
- [ ] Grant DynamoDB read/write to User and Distributor tables

---

## Phase 4: Backend Wiring (`amplify/backend.ts`)

### Task 4.1: Define Backend
- [ ] Import and wire `auth`, `data`, all Lambda functions
- [ ] Configure cross-resource permissions (Lambda → Cognito, Lambda → DynamoDB, Lambda → AppSync)
- [ ] Ensure `createUser` Lambda has all required IAM permissions

---

## Phase 5: Deploy & Configure Sandbox

### Task 5.1: Initial Deployment
- [ ] Run `npx ampx sandbox --profile amplify-alphie`
- [ ] Verify deployment succeeds
- [ ] Verify `amplify_outputs.json` is generated

### Task 5.2: Set Secrets
- [ ] `npx ampx sandbox secret set GOOGLE_CLIENT_ID --profile amplify-alphie`
- [ ] `npx ampx sandbox secret set GOOGLE_CLIENT_SECRET --profile amplify-alphie`
- [ ] `npx ampx sandbox secret set SIWA_CLIENT_ID --profile amplify-alphie`
- [ ] `npx ampx sandbox secret set SIWA_KEY_ID --profile amplify-alphie`
- [ ] `npx ampx sandbox secret set SIWA_PRIVATE_KEY --profile amplify-alphie`
- [ ] `npx ampx sandbox secret set SIWA_TEAM_ID --profile amplify-alphie`
- [ ] `npx ampx sandbox secret set SENDGRID_API_KEY --profile amplify-alphie`

### Task 5.3: Verify Backend
- [ ] Test `createUser` mutation via AppSync console (distributor flow — inviteCode should be null)
- [ ] Test `createUser` mutation via AppSync console (affiliate flow — inviteCode generated, parentEmail set, depth incremented)
- [ ] Test `approveDistributor` mutation — inviteCode generated on User record
- [ ] Test `getDownlineTree` query — returns correct tree structure
- [ ] Verify Cognito group assignment after `createUser`
- [ ] Verify field-level auth: owner cannot update `role`, `distributorId`, `parentEmail`, `depth`, `status`
- [ ] Verify guest can read Distributor (non-sensitive fields only)
- [ ] Verify guest can read User.inviteCode (for invite link validation)
- [ ] Verify guest cannot read bank/payment fields

---

## Phase 6: Backend Security Verification

- [ ] **Role escalation blocked** — `createUser` rejects `role: 'ADMIN'`
- [ ] **Group assignment guaranteed** — after `createUser`, user is always in DISTRIBUTOR or AFFILIATE group
- [ ] **Account linking requires verified email** — Pre Sign-Up rejects unverified social email
- [ ] **Invalid inviteCode rejected** — affiliate `createUser` with non-existent inviteCode fails
- [ ] **Unapproved distributor chain rejected** — affiliate `createUser` where root distributor is PENDING fails
- [ ] **PENDING distributor has no inviteCode** — distributor User.inviteCode is null until `approveDistributor`
- [ ] **Owner cannot self-approve** — `updateDistributor` with `status: APPROVED` rejected by field-level auth
- [ ] **Owner cannot change role/tree fields** — `updateUser` with `role`, `distributorId`, `parentEmail`, `depth` rejected by field-level auth
- [ ] **Guest cannot read bank details** — guest query on Distributor returns null for bank/payment fields
- [ ] **Idempotent** — duplicate `createUser` for same email is rejected
- [ ] **Caller verification** — `createUser` with mismatched email is rejected
- [ ] **Downline tree scoped** — `getDownlineTree` only returns descendants, not siblings or ancestors
- [ ] **approveDistributor admin-only** — non-admin caller rejected

---

## Files Created

| File | Purpose |
|------|---------|
| `amplify/data/resource.ts` | User + Distributor schemas, custom mutations/queries |
| `amplify/data/create-user/resource.ts` | `createUser` Lambda definition |
| `amplify/data/create-user/handler.ts` | Unified user creation logic |
| `amplify/data/get-downline-tree/resource.ts` | `getDownlineTree` Lambda definition |
| `amplify/data/get-downline-tree/handler.ts` | Recursive tree query |
| `amplify/data/approve-distributor/resource.ts` | `approveDistributor` Lambda definition |
| `amplify/data/approve-distributor/handler.ts` | Approve + generate inviteCode |
| `amplify/auth/resource.ts` | Auth config: OTP, Google, Apple, groups, triggers |
| `amplify/auth/post-confirmation/resource.ts` | Post-Confirmation Lambda definition |
| `amplify/auth/post-confirmation/handler.ts` | Thin proxy → calls `createUser` via IAM |
| `amplify/auth/pre-sign-up/resource.ts` | Pre Sign-Up Lambda definition |
| `amplify/auth/pre-sign-up/handler.ts` | Account linking + social sign-up |
| `amplify/auth/custom-email-sender/resource.ts` | SendGrid sender definition |
| `amplify/auth/custom-email-sender/handler.ts` | SendGrid email delivery |
| `amplify/backend.ts` | Backend orchestration + permissions |
