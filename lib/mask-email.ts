/**
 * Mask an email address for display in confirmation screens.
 *
 * Keeps the first character of the local part and the full domain; replaces
 * the rest of the local part with `***`. Matches the Figma spec's format:
 *
 *   `alex@gmail.com`      → `a***@gmail.com`
 *   `john.doe@work.com`   → `j***@work.com`
 *   `a@gmail.com`         → `a***@gmail.com`
 *
 * For obviously-malformed inputs (no `@`, empty local), returns the input
 * unchanged rather than throwing — this is a display helper, not a validator.
 */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at);
  return `${local[0]}***${domain}`;
}
