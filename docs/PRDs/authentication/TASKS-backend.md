# Tasks: Authentication — Backend

**PRD:** [PRD-authentication.md](./PRD-authentication.md)
**AWS Profile:** `amplify-alphie`

---

## Phase 1: Data Models & Schema

### Task 1.1: User Model (`amplify/data/resource.ts`)
- [x] Replace Todo model with User schema
- [x] Fields: `email` (PK), `role`, `distributorId` (nullable), `parentEmail` (nullable), `inviteCode` (nullable, unique), `depth` (integer), `firstName`, `lastName`, `countries`
- [x] Self-referencing relationships:
  - `parent: a.belongsTo('User', 'parentEmail')` — inviter
  - `children: a.hasMany('User', 'parentEmail')` — invitees (creates GSI on `parentEmail`)
  - `distributor: a.belongsTo('Distributor', 'distributorId')` — root distributor
- [x] Field-level auth (`.identityClaim('email')` required — default `sub` won't match email string):
  - Model-level: `allow.ownerDefinedIn('email').identityClaim('email')` + `allow.group('ADMIN')` + `allow.guest().to(['get'])`
  - `email`: owner read + guest read + ADMIN (required field needs explicit auth)
  - `role`: owner read + ADMIN (owner cannot update)
  - `distributorId`: owner read + ADMIN (owner cannot update)
  - `parentEmail`: owner read + ADMIN (owner cannot update)
  - `inviteCode`: owner read + ADMIN + guest read (guest needs for invite link validation)
  - `depth`: owner read + ADMIN (owner cannot update)
  - `firstName`, `lastName`: owner read+update + ADMIN (field-level auth)
  - `countries`: inherits model-level (owner can read/update)

### Task 1.2: Distributor Model (`amplify/data/resource.ts`)
- [x] Add Distributor schema
- [x] Fields: `distributorId` (PK), `ownerEmail`, `status`, `firstName`, `lastName`, `countries`, `bankName`, `bankAccountNumber`, `bankAccountName`, `bankBranch`, `paymentSlipPath`, `paymentNotes` (timestamps auto-managed by Amplify)
- [x] Field-level auth (`.identityClaim('email')` required — matches `ownerEmail` against JWT `email` claim):
  - Model-level: `allow.ownerDefinedIn('ownerEmail').identityClaim('email')` + `allow.group('ADMIN')` + `allow.guest().to(['read'])`
  - `distributorId`: owner read + ADMIN + guest read (required field)
  - `ownerEmail`: owner read + ADMIN (no guest access)
  - `status`: owner read + ADMIN + guest read (required field, needed for invite validation)
  - `bankName`, `bankAccountNumber`, `bankAccountName`, `bankBranch`, `paymentSlipPath`, `paymentNotes`: `allow.ownerDefinedIn('ownerEmail').identityClaim('email')` + `allow.group('ADMIN')` (hidden from guests)
  - `firstName`, `lastName`, `countries`: inherit model-level (guests can read)
- [x] Invite link validation uses standard `getDistributor` query — guest reads `distributorId`, `status`, `firstName`, `lastName`

---

## Phase 2: Auth Resource Configuration

### Task 2.1: Email OTP + Groups (`amplify/auth/resource.ts`)
- [x] Email OTP enabled via CDK override: `Policies.SignInPolicy.AllowedFirstAuthFactors: ['EMAIL_OTP', 'PASSWORD']` + `ExplicitAuthFlows: ['ALLOW_USER_AUTH', ...]` on UserPoolClient
- [x] Add `groups: ['DISTRIBUTOR', 'AFFILIATE', 'ADMIN']`
- [x] Set `custom:role` attribute with `mutable: false`
- [x] Set `custom:inviteCode` attribute with `mutable: false`
- [x] Set `custom:countries` attribute with `mutable: false`

### Task 2.2: Social Providers (`amplify/auth/resource.ts`)
- [x] Add Google provider config with `secret('GOOGLE_CLIENT_ID')`, `secret('GOOGLE_CLIENT_SECRET')`
- [x] Add Apple Sign In config with `secret('SIWA_CLIENT_ID')`, `secret('SIWA_KEY_ID')`, `secret('SIWA_PRIVATE_KEY')`, `secret('SIWA_TEAM_ID')`
- [x] Configure `callbackUrls`: `['http://localhost:3000/login', 'https://your-domain.com/login']`
- [x] Configure `logoutUrls`: `['http://localhost:3000/login', 'https://your-domain.com/login']`

### Task 2.3: Wire Triggers (`amplify/auth/resource.ts` + `amplify/backend.ts`)
- [x] Wire `preSignUp` trigger in `defineAuth`
- [x] Wire `customEmailSender` via CDK override on UserPool `LambdaConfig.CustomEmailSender` (not via `senders.email` — requires CDK-level KMS key setup)
- [x] Configure IAM permissions for triggers in `backend.ts`

---

## Phase 3: Lambda Functions

### Task 3.1: `createUser` Lambda Handler
Unified mutation called by frontend after sign-up (email OTP or social) for all roles.

**Files:**
- [x] `amplify/data/create-user/resource.ts` — `defineFunction` with `resourceGroupName: 'data'`
- [x] `amplify/data/create-user/handler.ts` — handler logic

**Schema wiring (`amplify/data/resource.ts`):**
- [x] Define `createUser` custom mutation using `a.handler.function(createUserFn)`
- [x] Arguments: `email`, `role`, `firstName`, `lastName`, `countries`, `inviteCode` (nullable — required for affiliates, null for distributors)
- [x] Returns: User type
- [x] Auth: `allow.authenticated()` (frontend-driven, no IAM caller)

**Handler logic (sequential):**
- [x] 1. **Role whitelist** — only accept `DISTRIBUTOR` or `AFFILIATE`. Reject `ADMIN`.
- [x] 2. **Verify caller** — authenticated user's email must match `email` arg. Skip for IAM callers.
- [x] 3. **Idempotent check** — query User table, reject if User already exists.
- [x] 4. **For distributors:**
  - [x] Generate `distributorId` (random lowercase a-z, min 8 chars, verify uniqueness)
  - [x] Create Distributor record in DynamoDB (`status: PENDING`)
  - [x] Create User record (`distributorId` = new ID, `parentEmail: null`, `depth: 0`, `inviteCode: null`)
- [x] 5. **For affiliates:**
  - [x] Look up inviter by `inviteCode` argument
  - [x] Validate inviter exists and root distributor (`inviter.distributorId`) has `status === APPROVED`
  - [x] Generate `inviteCode` for new affiliate (random lowercase a-z, min 8 chars, verify uniqueness)
  - [x] Create User record (`distributorId` = inviter's distributorId, `parentEmail` = inviter's email, `depth` = inviter's depth + 1, `inviteCode` = new code)
- [x] 6. **Assign Cognito group** — call `AdminAddUserToGroup`. If fails, delete created records and throw (rollback).

**Permissions (`amplify/backend.ts`):**
- [x] Grant `cognito-idp:AdminAddUserToGroup` via PolicyStatement
- [x] Grant DynamoDB read/write to User and Distributor tables

### Task 3.2: [REMOVED] Post-Confirmation Lambda
Removed to avoid circular CDK stack dependency (auth → function → data → auth). Frontend calls `createUser` mutation directly after sign-up for all flows (distributor, affiliate, social).

### Task 3.3: Pre Sign-Up Lambda (Account Linking)
Fires before Cognito creates a new user. Handles social sign-in linking/registration.

**Files:**
- [x] `amplify/auth/pre-sign-up/resource.ts` — `defineFunction` with `resourceGroupName: 'auth'`
- [x] `amplify/auth/pre-sign-up/handler.ts`

**Handler logic:**
- [x] Detect federated (social) sign-up events
- [x] **Security:** verify `email_verified === 'true'` from social provider. Reject if not verified.
- [x] Call `AdminListUsers` to find existing user by email
- [x] If found → call `AdminLinkProviderForUser` to link social identity, set `autoConfirmUser = true`, `autoVerifyEmail = true`
- [x] If not found → allow sign-up, set `autoConfirmUser = true`, `autoVerifyEmail = true`
- [x] For non-federated sign-ups → pass through unchanged
- [x] Gets `USER_POOL_ID` from `event.userPoolId` (avoids circular dep with auth stack)

**Permissions:**
- [x] Grant `cognito-idp:ListUsers` and `cognito-idp:AdminLinkProviderForUser` via PolicyStatement (wildcard resource to avoid circular ref)

### Task 3.4: Custom Email Sender Lambda (SendGrid)
Intercepts Cognito email events and sends via SendGrid API.

**Files:**
- [x] `amplify/auth/custom-email-sender/resource.ts` — `defineFunction` with `SENDGRID_API_KEY` via `secret()`, `resourceGroupName: 'auth'`
- [x] `amplify/auth/custom-email-sender/handler.ts`

**Handler logic:**
- [x] Handle `CustomEmailSender_SignUp` — verification/confirmation code
- [x] Handle `CustomEmailSender_Authentication` — OTP login code
- [x] Handle `CustomEmailSender_ForgotPassword` — password reset (if needed)
- [x] Use `fetch` to SendGrid v3 API (`/v3/mail/send`)
- [x] KMS decryption of encrypted code via `@aws-crypto/client-node`

**KMS + Wiring (`amplify/backend.ts`):**
- [x] Create KMS key (`aws-cdk-lib/aws-kms Key`) for Cognito code encryption
- [x] Grant Lambda `kms:Decrypt` permission
- [x] Set `KMS_KEY_ARN` environment variable on Lambda
- [x] Wire `LambdaConfig.CustomEmailSender` on UserPool via CDK override
- [x] Wire `LambdaConfig.KMSKeyID` on UserPool via CDK override
- [x] Grant Cognito `lambda:InvokeFunction` permission on the Lambda

### Task 3.5: `getDownlineTree` Custom Query (Lambda Handler)
Recursively fetches the downline tree for a given user.

**Files:**
- [x] `amplify/data/get-downline-tree/resource.ts` — `defineFunction` with `resourceGroupName: 'data'`
- [x] `amplify/data/get-downline-tree/handler.ts`

**Schema wiring:**
- [x] Define `getDownlineTree` custom query in `amplify/data/resource.ts`
- [x] Arguments: `rootEmail: String`
- [x] Returns: array of `{ email, firstName, lastName, depth, parentEmail, inviteCode, countries, role }`
- [x] Auth: `allow.authenticated()`

**Handler logic:**
- [x] Fetch root user by email
- [x] Verify caller is the root user or an admin (security)
- [x] Breadth-first traversal (Scan + filter on `distributorId`, then BFS on `parentEmail`)
- [x] Return flattened array of all descendants

**Permissions:**
- [x] Grant DynamoDB read access to User table

### Task 3.6: `approveDistributor` Custom Mutation (Lambda Handler)
Atomically approves a distributor and generates their invite code.

**Files:**
- [x] `amplify/data/approve-distributor/resource.ts` — `defineFunction` with `resourceGroupName: 'data'`
- [x] `amplify/data/approve-distributor/handler.ts`

**Schema wiring:**
- [x] Define `approveDistributor` custom mutation in `amplify/data/resource.ts`
- [x] Arguments: `distributorId: String`
- [x] Returns: Distributor type
- [x] Auth: `allow.group('ADMIN')` only

**Handler logic:**
- [x] Validate Distributor exists and `status === PENDING`
- [x] Update `Distributor.status = APPROVED`
- [x] Generate `inviteCode` for distributor's User record (random lowercase a-z, min 8 chars, verify uniqueness)
- [x] Update `User.inviteCode`
- [x] Both updates atomic via `TransactWriteItemsCommand`

**Permissions:**
- [x] Grant DynamoDB read/write to User and Distributor tables

---

## Phase 4: Backend Wiring (`amplify/backend.ts`)

### Task 4.1: Define Backend
- [x] Import and wire `auth`, `data`, all Lambda functions
- [x] Configure cross-resource permissions (Lambda → Cognito, Lambda → DynamoDB)
- [x] Ensure `createUser` Lambda has all required IAM permissions
- [x] CDK overrides: EMAIL_OTP sign-in policy, USER_AUTH explicit auth flows
- [x] CDK overrides: KMS key + CustomEmailSender wiring

---

## Phase 5: Deploy & Configure Sandbox

### Task 5.1: Initial Deployment
- [x] Run `npx ampx sandbox --profile amplify-alphie`
- [x] Verify deployment succeeds
- [x] Verify `amplify_outputs.json` is generated

### Task 5.2: Set Secrets
- [x] `npx ampx sandbox secret set GOOGLE_CLIENT_ID --profile amplify-alphie`
- [x] `npx ampx sandbox secret set GOOGLE_CLIENT_SECRET --profile amplify-alphie`
- [x] `npx ampx sandbox secret set SIWA_CLIENT_ID --profile amplify-alphie`
- [x] `npx ampx sandbox secret set SIWA_KEY_ID --profile amplify-alphie`
- [x] `npx ampx sandbox secret set SIWA_PRIVATE_KEY --profile amplify-alphie`
- [x] `npx ampx sandbox secret set SIWA_TEAM_ID --profile amplify-alphie`
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
| `amplify/data/create-user/handler.ts` | Unified user creation logic with rollback |
| `amplify/data/get-downline-tree/resource.ts` | `getDownlineTree` Lambda definition |
| `amplify/data/get-downline-tree/handler.ts` | Recursive tree query (BFS) |
| `amplify/data/approve-distributor/resource.ts` | `approveDistributor` Lambda definition |
| `amplify/data/approve-distributor/handler.ts` | Atomic approve + generate inviteCode (TransactWriteItems) |
| `amplify/auth/resource.ts` | Auth config: OTP, Google, Apple, groups, preSignUp trigger |
| `amplify/auth/pre-sign-up/resource.ts` | Pre Sign-Up Lambda definition |
| `amplify/auth/pre-sign-up/handler.ts` | Account linking + social sign-up |
| `amplify/auth/custom-email-sender/resource.ts` | SendGrid sender definition with SENDGRID_API_KEY secret |
| `amplify/auth/custom-email-sender/handler.ts` | SendGrid email delivery with KMS decryption |
| `amplify/backend.ts` | Backend orchestration, permissions, CDK overrides (KMS, EMAIL_OTP, CustomEmailSender) |
