"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { CountryChip } from "./CountryChip";
import { CountrySelect } from "./CountrySelect";
import { COUNTRIES, findCountry, type Country } from "./countries";

const MAX_SELECTION = 3;

export type SelectCountryFormProps = {
  /** Called with the selected ISO codes when the user clicks Continue. */
  onSubmit?: (countries: string[]) => void | Promise<void>;
  /** Override the country list. Defaults to the project's standard list. */
  countries?: readonly Country[];
  /** Initial selection. Useful for editing previously-saved preferences. */
  defaultValue?: string[];
  /** Disables inputs and the Continue button. */
  isSubmitting?: boolean;
  /** Override outer className. */
  className?: string;
};

/**
 * Select Country form.
 *
 * Source: Figma node 137:56229 ("Registration" layer, actually Select
 * Country content) in the Aim Earn UI file. Presents a multi-select
 * dropdown of countries plus a chip row of current selections. Client
 * component — owns the selection state.
 *
 * Matches Registration/OtpForm layout: 840px min-height centered content,
 * 354px form column, shared brand Button.
 */
export function SelectCountryForm({
  onSubmit,
  countries = COUNTRIES,
  defaultValue = [],
  isSubmitting = false,
  className,
}: SelectCountryFormProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected.length === 0) return;
    await onSubmit?.(selected);
  };

  const removeOne = (code: string) =>
    setSelected((prev) => prev.filter((c) => c !== code));

  return (
    <section
      className={["w-full bg-surface-card", className ?? ""].join(" ")}
      aria-labelledby="select-country-heading"
    >
      <div className="flex min-h-[840px] flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
        {/* Heading */}
        <header className="flex h-14 w-full flex-col items-center justify-center gap-2 text-center">
          <h2
            id="select-country-heading"
            className="whitespace-nowrap text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
          >
            Select Country
          </h2>
          <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
            Select all countries you operate in. (Maximum {MAX_SELECTION}{" "}
            countries)
          </p>
        </header>

        {/* Form + chips + submit */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[354px] flex-col items-start gap-8"
          noValidate
        >
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full flex-col gap-2">
              <label
                id="countries-label"
                htmlFor="countries-select"
                className="text-base font-medium leading-[1.4] tracking-figma text-ink"
              >
                Countries
              </label>
              <CountrySelect
                id="countries-select"
                labelId="countries-label"
                maxSelection={MAX_SELECTION}
                value={selected}
                onChange={setSelected}
                countries={countries}
                disabled={isSubmitting}
              />
            </div>

            {selected.length > 0 ? (
              <div
                className="flex w-full flex-wrap items-start gap-2 min-h-20"
                aria-live="polite"
                aria-label="Selected countries"
              >
                {selected.map((code) => {
                  const country = findCountry(code);
                  if (!country) return null;
                  return (
                    <CountryChip
                      key={code}
                      label={country.name}
                      disabled={isSubmitting}
                      onRemove={() => removeOne(code)}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>

          <Button
            type="submit"
            variant="brand"
            size="md"
            disabled={selected.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Continue"}
          </Button>
        </form>
      </div>
    </section>
  );
}
