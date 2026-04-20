/**
 * Country data for the Select Country component.
 *
 * Keyed by ISO 3166-1 alpha-2 code so the value submitted to a backend is
 * stable regardless of display-name localization.
 *
 * The list is a reasonable default covering the markets an Aim Earn
 * distributor platform is likely to operate in — replace or extend in
 * `app/**` or a dedicated `lib/countries.ts` as product needs grow.
 */

export type Country = {
  /** ISO 3166-1 alpha-2 code, uppercase. */
  code: string;
  /** Display name in English. */
  name: string;
};

export const COUNTRIES: readonly Country[] = [
  { code: "CN", name: "China" },
  { code: "GB", name: "United Kingdom" },
  { code: "HK", name: "Hong Kong" },
  { code: "ID", name: "Indonesia" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "MY", name: "Malaysia" },
  { code: "NZ", name: "New Zealand" },
  { code: "PH", name: "Philippines" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "TW", name: "Taiwan" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
