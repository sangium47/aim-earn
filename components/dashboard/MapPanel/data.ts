// Affiliate member counts by country. Only countries with an entry here
// will be colored on the map — everything else falls back to the neutral gray.
//
// ISO codes match `world-atlas`'s `countries-110m.json`, which uses ISO 3166-1
// numeric codes as the `id` on each geography feature.

import type { CountryDatum } from "@/components/type";

// Palette sampled from the Figma — an amber/gold scale from light to dark.
// Darker = larger affiliate base.
export const MAP_COLORS = {
  malaysia: "#7A4A0E", // 20,000 — deepest amber
  singapore: "#231405", // 10,000 — near-black brown
  thailand: "#F0C93F", // 2,000  — bright gold
  myanmar: "#C67A1E", // accent country shown in the Figma (no popup)
  defaultLand: "#D6D6D6",
  water: "#FFFFFF",
  stroke: "#FFFFFF",
} as const;

export const COUNTRY_DATA: readonly CountryDatum[] = [
  {
    id: "458",
    iso3: "MYS",
    name: "Malaysia",
    members: 20000,
    fill: MAP_COLORS.malaysia,
    coordinates: [101.9758, 4.2105],
    labelOffset: { dx: -110, dy: 0 },
  },
  {
    id: "702",
    iso3: "SGP",
    name: "Singapore",
    members: 10000,
    fill: MAP_COLORS.singapore,
    coordinates: [103.8198, 1.3521],
    labelOffset: { dx: 30, dy: 30 },
  },
  {
    id: "764",
    iso3: "THA",
    name: "Thailand",
    members: 2000,
    fill: MAP_COLORS.thailand,
    coordinates: [100.9925, 15.87],
    labelOffset: { dx: 20, dy: 20 },
  },
  {
    // Shown colored on the Figma but without its own popup — keep it on the map.
    id: "104",
    iso3: "MMR",
    name: "Myanmar",
    members: 0,
    fill: MAP_COLORS.myanmar,
    coordinates: [95.9562, 21.9162],
    labelOffset: { dx: 0, dy: 0 },
  },
];

// Subset that actually renders a popup card on the map.
export const COUNTRIES_WITH_POPUP = COUNTRY_DATA.filter((c) => c.members > 0);

// Fast lookup by numeric id while rendering <Geography />.
export const COUNTRY_FILL_BY_ID = new Map(
  COUNTRY_DATA.map((c) => [c.id, c.fill]),
);
