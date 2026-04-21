"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { Dropdown } from "@/components/shared";
import { CountryChip } from "./CountryChip";
import { CountrySelect } from "./CountrySelect";
import { COUNTRIES, findCountry, type Country } from "./countries";

const DEFAULT_MAX_SELECTION = 3;

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
  /** Maximum number of countries the user may select. Defaults to 3. */
  maxSelection?: number;
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
  maxSelection = DEFAULT_MAX_SELECTION,
}: SelectCountryFormProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const isSingleSelect = maxSelection === 1;

  const dropdownOptions = useMemo(
    () => countries.map((c) => ({ label: c.name, value: c.code })),
    [countries],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected.length === 0) return;
    await onSubmit?.(selected);
  };

  return (
    <section
      className={["w-full bg-surface-card", className ?? ""].join(" ")}
      aria-labelledby="select-country-heading"
    >
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Heading */}
        <header className="flex h-14 w-full flex-col items-center justify-center gap-2 text-center">
          <h2
            id="select-country-heading"
            className="whitespace-nowrap text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
          >
            Select Country
          </h2>
          <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
            {isSingleSelect
              ? "Select the country you operate in."
              : `Select all countries you operate in. (Maximum ${maxSelection} countries)`}
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
              {isSingleSelect ? (
                <Dropdown
                  label="Country"
                  value={selected[0] ?? ""}
                  onChange={(value) => setSelected(value ? [value] : [])}
                  options={dropdownOptions}
                  placeholder="Select Country"
                  fullWidth
                  disabled={isSubmitting}
                />
              ) : (
                <>
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
                    maxSelection={maxSelection}
                    value={selected}
                    onChange={setSelected}
                    countries={countries}
                    disabled={isSubmitting}
                  />
                </>
              )}
            </div>

            {!isSingleSelect && selected.length > 0 ? (
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
                      onRemove={
                        isSubmitting
                          ? undefined
                          : () =>
                              setSelected((prev) =>
                                prev.filter((c) => c !== code),
                              )
                      }
                    />
                  );
                })}
              </div>
            ) : null}
          </div>

          {onSubmit ? (
            <Button
              type="submit"
              variant="brand"
              size="md"
              disabled={selected.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Continue"}
            </Button>
          ) : null}
        </form>
      </div>
    </section>
  );
}
