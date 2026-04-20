# Aim Earn — Registration Form

Next.js 15 App Router + TypeScript + Tailwind CSS implementation of the
"Register as a distributor" component from Figma node [137:56199][figma].

[figma]: https://www.figma.com/design/kJpRTVehQXIGLtnVqScr3U/Aim-Earn---UI-Design-Client---Copy-?node-id=137-56199

## File layout

```
app/
  layout.tsx                        Root layout — loads Urbanist + Nunito Sans via next/font
  page.tsx                          Demo page using the component
  globals.css                       Tailwind directives
components/
  registration-form/
    RegistrationForm.tsx            Main component (client — owns form state)
    InputField.tsx                  Labeled text input primitive
    SocialButton.tsx                Outlined pill button for social sign-in
    icons.tsx                       Inlined Google / Facebook / Apple SVGs
    index.ts                        Barrel export
tailwind.config.ts                  Design tokens mapped from Figma SDS variables
```

## Using the component

```tsx
import { RegistrationForm } from "@/components/registration-form";

<RegistrationForm
  onSubmit={async ({ firstName, lastName, email }) => {
    await fetch("/api/register", { method: "POST", body: JSON.stringify({ firstName, lastName, email }) });
  }}
  onGoogleSignIn={() => signIn("google")}
  onFacebookSignIn={() => signIn("facebook")}
  onAppleSignIn={() => signIn("apple")}
/>
```

## Fonts

The Urbanist and Nunito Sans typefaces are loaded via
[`@fontsource-variable`](https://fontsource.org/) packages (self-hosted
variable fonts) rather than `next/font/google`. This:

- Works fully offline / in air-gapped CI
- Avoids the Google Fonts CDN (GDPR-friendly)
- Ships a single variable font file per family instead of 4 weight files

The imports live in `app/layout.tsx`. Tailwind's `font-sans` and `font-body`
utilities point at the loaded family names (see `tailwind.config.ts`
`fontFamily`).

## Design token mapping

All Figma `--sds-*` variables from the selected node are mapped in
`tailwind.config.ts`. Key mappings:

| Figma variable                             | Tailwind token          |
| ------------------------------------------ | ----------------------- |
| `--sds-color-background-brand-default`     | `bg-brand` (#f8d237)    |
| `Text/Brand/On Brand`                      | `text-brand-foreground` |
| `--sds-color-background-default-default`   | `bg-surface-input`      |
| `--sds-color-text-default-default`         | `text-ink`              |
| `--sds-color-text-brand-secondary`         | `text-ink-secondary`    |
| `Text/Base/Tertiary`                       | `text-ink-tertiary`     |
| `--sds-color-border-default-default`       | `border-line`           |
| `--sds-color-border-neutral-tertiary`      | `border-line-tertiary`  |
| `BG` (page)                                | `bg-surface-page`       |
| `--sds-size-radius-200` (8px)              | `rounded-lg`            |
| `--sds-size-radius-full`                   | `rounded-full`          |
| outer card radius (24px)                   | `rounded-card`          |

## Decisions that needed inference

1. **Brand icons inlined as SVG** instead of downloaded from Figma's CDN.
   The Figma source references raster PNGs via signed URLs that expire in
   7 days. Inlined vector marks are crisper, never rot, and style via
   `currentColor` where appropriate (Apple mark is monochromatic and
   colorable; Google/Facebook are brand-colored and fixed).
2. **Font families simplified**: Urbanist + Nunito Sans only, loaded via
   self-hosted `@fontsource-variable` packages. The Figma frame layered in
   Roboto (Google button) and SF Pro (Facebook + Apple buttons) — those are
   the respective platforms' brand fonts, but adding two more font families
   for three lines of copy isn't worth the bundle cost. If brand compliance
   requires them back, add `@fontsource/roboto` and fall back to
   `-apple-system` on the Apple button.
3. **Responsive behavior**: the Figma frame is desktop-only. The component
   itself uses `w-full max-w-[354px]` for the form column so it collapses
   cleanly on narrower viewports. The outer card hits `min-h-[840px]` on
   desktop and shrinks to content on mobile.
4. **Form accessibility**: labels wired via `htmlFor`/`id`, heading
   associated with the section via `aria-labelledby`, "Or" given
   `role="separator"`, social buttons each get `aria-label`.

## Verification

- ✅ Copy is verbatim from Figma ("Register as a distributor", "Enter your
  details below to register", placeholders, button labels).
- ✅ Server/client split: only `RegistrationForm` and the demo page are
  `"use client"`; primitives and icons are server components.
- ✅ All interactive elements are `<button>` / `<input>` / `<label>`.
- ✅ Path alias `@/*` wired through `tsconfig.json`.
- ✅ Typed `Props` on every component.

## Run

```bash
npm install
npm run dev
```

Then visit <http://localhost:3000>.
