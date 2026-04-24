const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@aimearn.com';
const KMS_KEY_ARN = process.env.KMS_KEY_ARN!;

// Lazy-init crypto client to reduce cold start time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let decryptFn: any = null;
let keyringInstance: unknown = null;

async function getDecryptor() {
  if (!decryptFn) {
    const { buildClient, CommitmentPolicy } = await import(
      '@aws-crypto/client-node'
    );
    const { KmsKeyringNode } = await import('@aws-crypto/kms-keyring-node');
    const { decrypt } = buildClient(
      CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT
    );
    decryptFn = decrypt;
    keyringInstance = new KmsKeyringNode({ keyIds: [KMS_KEY_ARN] });
  }
  return { decrypt: decryptFn, keyring: keyringInstance! };
}

interface CustomEmailSenderEvent {
  triggerSource: string;
  request: {
    type: string;
    code: string;
    userAttributes: Record<string, string>;
    clientMetadata?: Record<string, string>;
  };
  userName: string;
  userPoolId: string;
}

async function decryptCode(encryptedCode: string): Promise<string> {
  const { decrypt, keyring } = await getDecryptor();
  const { plaintext } = await decrypt(
    keyring,
    Buffer.from(encryptedCode, 'base64')
  );
  return Buffer.from(plaintext).toString('utf-8');
}

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDER_EMAIL, name: 'Aim Earn' },
      subject,
      content: [{ type: 'text/html', value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid API error: ${response.status} ${body}`);
  }
}

export const handler = async (event: CustomEmailSenderEvent) => {
  const email = event.request.userAttributes.email;
  if (!email) {
    throw new Error('No email in user attributes');
  }

  const code = await decryptCode(event.request.code);

  switch (event.triggerSource) {
    case 'CustomEmailSender_SignUp': {
      await sendEmail(
        email,
        'Verify your Aim Earn account',
        `<h2>Welcome to Aim Earn!</h2>
         <p>Your verification code is: <strong>${code}</strong></p>
         <p>This code expires in 10 minutes.</p>`
      );
      break;
    }

    case 'CustomEmailSender_Authentication': {
      await sendEmail(
        email,
        'Your Aim Earn login code',
        `<h2>Sign in to Aim Earn</h2>
         <p>Your one-time login code is: <strong>${code}</strong></p>
         <p>This code expires in 5 minutes.</p>`
      );
      break;
    }

    case 'CustomEmailSender_ForgotPassword': {
      await sendEmail(
        email,
        'Reset your Aim Earn password',
        `<h2>Password Reset</h2>
         <p>Your password reset code is: <strong>${code}</strong></p>
         <p>This code expires in 10 minutes.</p>`
      );
      break;
    }

    default:
      console.log(`Unhandled trigger source: ${event.triggerSource}`);
  }
};
