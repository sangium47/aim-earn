import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createUserFn } from "./create-user/resource";
import { getDownlineTreeFn } from "./get-downline-tree/resource";
import { approveDistributorFn } from "./approve-distributor/resource";

const schema = a.schema({
  // ---------- Custom types ----------

  DownlineNode: a.customType({
    email: a.string().required(),
    firstName: a.string(),
    lastName: a.string(),
    depth: a.integer().required(),
    parentEmail: a.string(),
    inviteCode: a.string(),
    countries: a.string().array(),
    role: a.string().required(),
  }),

  // ---------- Models ----------

  User: a
    .model({
      email: a
        .string()
        .required()
        .authorization((allow) => [
          allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
          allow.guest().to(["read"]),
          allow.group("ADMIN"),
        ]),
      role: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
        ]),
      distributorId: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
        ]),
      parentEmail: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
        ]),
      inviteCode: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
          allow.guest().to(["read"]),
          allow.group("ADMIN"),
        ]),
      depth: a
        .integer()
        .authorization((allow) => [
          allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
        ]),
      firstName: a
        .string()
        .authorization((allow) => [
          allow
            .ownerDefinedIn("email")
            .identityClaim("email")
            .to(["read", "update"]),
          allow.group("ADMIN"),
        ]),
      lastName: a
        .string()
        .authorization((allow) => [
          allow
            .ownerDefinedIn("email")
            .identityClaim("email")
            .to(["read", "update"]),
          allow.group("ADMIN"),
        ]),
      countries: a.string().array(),
      // Self-referencing relationships
      parent: a.belongsTo("User", "parentEmail"),
      children: a.hasMany("User", "parentEmail"),
      // Distributor relationship
      distributor: a.belongsTo("Distributor", "distributorId"),
    })
    .identifier(["email"])
    .secondaryIndexes((index) => [index("inviteCode")])
    .disableOperations(["create", "delete"])
    .authorization((allow) => [
      allow.ownerDefinedIn("email").identityClaim("email").to(["read"]),
      allow.group("ADMIN"),
      allow.guest().to(["get"]),
    ]),

  Distributor: a
    .model({
      distributorId: a
        .string()
        .required()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
          allow.guest().to(["read"]),
        ]),
      ownerEmail: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
        ]),
      status: a
        .string()
        .required()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email").to(["read"]),
          allow.group("ADMIN"),
          allow.guest().to(["read"]),
        ]),
      firstName: a.string(),
      lastName: a.string(),
      countries: a.string().array(),
      bankName: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
          allow.group("ADMIN"),
        ]),
      bankAccountNumber: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
          allow.group("ADMIN"),
        ]),
      bankAccountName: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
          allow.group("ADMIN"),
        ]),
      bankBranch: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
          allow.group("ADMIN"),
        ]),
      paymentSlipPath: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
          allow.group("ADMIN"),
        ]),
      paymentNotes: a
        .string()
        .authorization((allow) => [
          allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
          allow.group("ADMIN"),
        ]),
      // Relationship
      users: a.hasMany("User", "distributorId"),
    })
    .identifier(["distributorId"])
    .disableOperations(["create", "delete"])
    .authorization((allow) => [
      allow.ownerDefinedIn("ownerEmail").identityClaim("email"),
      allow.group("ADMIN"),
      allow.guest().to(["read"]),
    ]),

  // ---------- Custom mutations ----------

  createUser: a
    .mutation()
    .arguments({
      email: a.string().required(),
      role: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      countries: a.string().array().required(),
      inviteCode: a.string(),
    })
    .returns(a.ref("User"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(createUserFn)),

  approveDistributor: a
    .mutation()
    .arguments({
      distributorId: a.string().required(),
    })
    .returns(a.ref("Distributor"))
    .authorization((allow) => [allow.group("ADMIN")])
    .handler(a.handler.function(approveDistributorFn)),

  // ---------- Custom queries ----------

  getDownlineTree: a
    .query()
    .arguments({
      rootEmail: a.string().required(),
    })
    .returns(a.ref("DownlineNode").array())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(getDownlineTreeFn)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "aimearn",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
