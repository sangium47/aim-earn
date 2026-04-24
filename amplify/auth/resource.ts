import { defineAuth, secret } from "@aws-amplify/backend";
import { preSignUp } from "./pre-sign-up/resource";

export const auth = defineAuth({
  name: "aimearn",
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Your Aim Earn verification code.",
      verificationEmailBody: (createCode) =>
        `Your verification code is: ${createCode()}`,
    },
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: ["email", "profile"],
        attributeMapping: {
          email: "email",
          givenName: "given_name",
          familyName: "family_name",
        },
      },
      signInWithApple: {
        clientId: secret("SIWA_CLIENT_ID"),
        keyId: secret("SIWA_KEY_ID"),
        privateKey: secret("SIWA_PRIVATE_KEY"),
        teamId: secret("SIWA_TEAM_ID"),
      },
      callbackUrls: [
        "http://localhost:3000/login",
        "https://your-domain.com/login",
      ],
      logoutUrls: [
        "http://localhost:3000/login",
        "https://your-domain.com/login",
      ],
    },
  },
  groups: ["DISTRIBUTOR", "AFFILIATE", "ADMIN"],
  userAttributes: {
    "custom:role": {
      dataType: "String",
      mutable: false,
    },
    "custom:inviteCode": {
      dataType: "String",
      mutable: false,
    },
    "custom:countries": {
      dataType: "String",
      mutable: false,
    },
  },
  triggers: {
    preSignUp,
  },
});
