import type { Config } from "tailwindcss";

/**
 * Tokens mapped from the Aim Earn Figma file's SDS variables.
 * Source of truth: `Figma:get_variable_defs` on node 137:56199.
 *
 * Naming convention:
 *   brand.*    → primary yellow CTA family
 *   surface.*  → fills (page / card / input)
 *   ink.*      → text colors
 *   line.*     → borders
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f8d237", // --sds-color-background-brand-default
          border: "#E7E7E7", // --sds-color-border-brand-default
          foreground: "#441f04", // Text/Brand/On Brand
        },
        surface: {
          page: "#f6f7f9", // BG
          card: "#ffffff",
          input: "#f4f5f8", // --sds-color-background-default-default
          chip: "#f1f1f1", // selected-item pill background (Select Country frame)
          brand: "#EAE7E2",
        },
        line: {
          DEFAULT: "#e7e7e7", // --sds-color-border-default-default
          muted: "#d0d0d0", // used on social button outlines in source
          tertiary: "#b2b2b2", // --sds-color-border-neutral-tertiary (card frame)
        },
        ink: {
          DEFAULT: "#222125", // --sds-color-text-default-default
          heading: "#1e1e1e", // title color in source
          base: "#2c2c2c", // --sds-color-text-brand-default
          secondary: "#757575", // --sds-color-text-brand-secondary
          tertiary: "#878787", // Text/Base/Tertiary (placeholders)
        },
        status: {
          paid: "#F5C242", // yellow segment
          delivered: "#FFFFFF", // white segment
          shipped: "#9B9B9B", // gray segment
        },
      },
      fontFamily: {
        sans: ['"Urbanist Variable"', "Urbanist", "system-ui", "sans-serif"],
        body: [
          '"Nunito Sans Variable"',
          '"Nunito Sans"',
          "system-ui",
          "sans-serif",
        ],
        heading: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "24px", // outer registration card
        // default `lg` ≈ 8px already matches --sds-size-radius-200
      },
      letterSpacing: {
        // Figma uses 2% letter-spacing on Urbanist Medium headings & body
        figma: "0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
