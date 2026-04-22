"use client";

import { useMemo, useState } from "react";
import { FilterBar, Switch } from "@/components/shared";
import { COUNTRY_NAMES } from "@/components/mock";

type CountryRow = {
  code: string;
  name: string;
  useDefault: boolean;
  distributor: string;
  originator: string;
  indirect: string;
  direct: string;
  published: boolean;
};

type Defaults = {
  distributor: string;
  originator: string;
  indirect: string;
  direct: string;
};

const DEFAULT_COUNTRIES: CountryRow[] = [
  { code: "SG", name: COUNTRY_NAMES.SG ?? "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "TH", name: COUNTRY_NAMES.TH ?? "Thailand" },
  { code: "MY", name: COUNTRY_NAMES.MY ?? "Malaysia" },
  { code: "VN", name: COUNTRY_NAMES.VN ?? "Vietnam" },
  { code: "ID", name: COUNTRY_NAMES.ID ?? "Indonesia" },
  { code: "PH", name: COUNTRY_NAMES.PH ?? "Philippines" },
  { code: "KR", name: "South Korea" },
].map<CountryRow>((c, i) => ({
  ...c,
  useDefault: i >= 2,
  distributor: (i === 0 ? 7 : i === 1 ? 10 : 10).toString(),
  originator: (i === 0 ? 3 : i === 1 ? 0 : 2).toString(),
  indirect: (i === 0 ? 5 : i === 1 ? 5 : 3).toString(),
  direct: (i === 0 ? 5 : i === 1 ? 5 : 5).toString(),
  published: true,
}));

const TIER_FIELDS = [
  "distributor",
  "originator",
  "indirect",
  "direct",
] as const;
type TierField = (typeof TIER_FIELDS)[number];

export function CommissionPolicyPanel() {
  const [aimEarn, setAimEarn] = useState("5");
  const [affiliate, setAffiliate] = useState("20");
  // Total Commission is derived: Aim Earn + Affiliate. It cannot be edited directly.
  const total = (Number(aimEarn || 0) + Number(affiliate || 0)).toString();

  const [defaults, setDefaults] = useState<Defaults>({
    distributor: "10",
    originator: "2",
    indirect: "3",
    direct: "5",
  });

  const [rows, setRows] = useState<CountryRow[]>(DEFAULT_COUNTRIES);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, search]);

  const affiliateCap = Number(affiliate || 0);

  /**
   * Clamp `next` so that updating `field` on `current` keeps the sum of all
   * four tier fields at or below the Affiliate cap. Returns the string that
   * should be written back to state.
   */
  const clampAgainstCap = (
    current: Record<TierField, string>,
    field: TierField,
    next: string,
  ): string => {
    const n = Math.max(0, Number(next) || 0);
    const otherSum = TIER_FIELDS.filter((f) => f !== field).reduce(
      (sum, f) => sum + Number(current[f] || 0),
      0,
    );
    const max = Math.max(0, affiliateCap - otherSum);
    return Math.min(n, max).toString();
  };

  const sumTiers = (tiers: Record<TierField, string>) =>
    TIER_FIELDS.reduce((sum, f) => sum + Number(tiers[f] || 0), 0);

  const defaultsSum = sumTiers(defaults);
  const defaultsRemaining = affiliateCap - defaultsSum;
  const defaultsInvalid = defaultsRemaining > 0;

  const updateRow = (index: number, patch: Partial<CountryRow>) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  };

  return (
    <div className="max-h-[calc(100vh-305px)] md:max-h-[calc(100vh-355px)] overflow-y-auto flex flex-col gap-4 md:gap-6">
      {/* Commission Policy */}
      <section className="flex flex-col gap-3 md:gap-4 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <h3 className="text-[16px] md:text-[18px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
          Commission Policy
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <PercentField
            label="Total Commission"
            value={total}
            onChange={() => {}}
            disabled
          />
          <PercentField
            label="Aim Earn"
            value={aimEarn}
            onChange={setAimEarn}
          />
          <PercentField
            label="Affiliate"
            value={affiliate}
            onChange={setAffiliate}
          />
        </div>
      </section>

      {/* Country Commission */}
      <section className="flex flex-col gap-3 md:gap-4">
        <h3 className="text-[16px] md:text-[18px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
          Country Commission
        </h3>

        {/* Default Commission card */}
        <div className="flex flex-col gap-3 md:gap-4 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
          <div className="flex flex-col gap-1">
            <h4 className="text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
              Default Commission
            </h4>
            <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
              The default Affiliate commission must not exceed{" "}
              <span className="font-semibold">{affiliate}%</span>, as defined by
              the platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <PercentField
              label="Distributor"
              value={defaults.distributor.toString()}
              onChange={(v) =>
                setDefaults((d) => ({
                  ...d,
                  distributor: clampAgainstCap(d, "distributor", v),
                }))
              }
              invalid={defaultsInvalid}
            />
            <PercentField
              label="Originator"
              value={defaults.originator.toString()}
              onChange={(v) =>
                setDefaults((d) => ({
                  ...d,
                  originator: clampAgainstCap(d, "originator", v),
                }))
              }
              invalid={defaultsInvalid}
            />
            <PercentField
              label="Indirect"
              value={defaults.indirect.toString()}
              onChange={(v) =>
                setDefaults((d) => ({
                  ...d,
                  indirect: clampAgainstCap(d, "indirect", v),
                }))
              }
              invalid={defaultsInvalid}
            />
            <PercentField
              label="Direct"
              value={defaults.direct.toString()}
              onChange={(v) =>
                setDefaults((d) => ({
                  ...d,
                  direct: clampAgainstCap(d, "direct", v),
                }))
              }
              invalid={defaultsInvalid}
            />
          </div>
          {defaultsInvalid ? (
            <div className="flex items-start gap-2 rounded-lg border border-[#ef4444] bg-[#fef2f2] px-3 py-2">
              <p className="text-[13px] font-medium leading-[1.4] tracking-[0.02em] text-[#b42318]">
                <span className="font-semibold">{defaultsRemaining}%</span>{" "}
                commission remaining to allocate before reaching the Affiliate
                cap ({affiliateCap}%).
              </p>
            </div>
          ) : null}
        </div>

        {/* Search */}
        <FilterBar
          searchValue={search}
          searchPlaceholder="Search by country"
          onSearchChange={setSearch}
        />

        {/* Table */}
        <div className="flex flex-col rounded-2xl bg-white shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="bg-[#eae7e2] text-[14px] font-semibold text-[#1e1e1e]">
                  <th className="min-w-[90px] px-4 py-2 font-semibold">
                    Use Default
                  </th>
                  <th className="min-w-[180px] px-4 py-2 font-semibold">
                    Country
                  </th>
                  <th className="min-w-[120px] px-4 py-2 font-semibold">
                    Distributor
                  </th>
                  <th className="min-w-[120px] px-4 py-2 font-semibold">
                    Originator
                  </th>
                  <th className="min-w-[120px] px-4 py-2 font-semibold">
                    Indirect
                  </th>
                  <th className="min-w-[120px] px-4 py-2 font-semibold">
                    Direct
                  </th>
                  <th className="w-[90px] px-4 py-2 font-semibold">Publish</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const index = rows.indexOf(row);
                  const rowSum = sumTiers(row);
                  const rowRemaining = affiliateCap - rowSum;
                  const rowInvalid = !row.useDefault && rowRemaining > 0;
                  return (
                    <tr
                      key={row.code}
                      className={`border-t border-line align-middle ${rowInvalid ? "bg-[#fef2f2]" : "bg-white"}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={row.useDefault}
                          onChange={(e) =>
                            updateRow(index, {
                              useDefault: e.target.checked,
                              ...(e.target.checked
                                ? {
                                    distributor: defaults.distributor,
                                    originator: defaults.originator,
                                    indirect: defaults.indirect,
                                    direct: defaults.direct,
                                  }
                                : {}),
                            })
                          }
                          aria-label={`Use default commission for ${row.name}`}
                          className="size-4 accent-brand cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-[15px] font-medium text-[#222125]">
                        {row.name}
                      </td>
                      {TIER_FIELDS.map((field) => (
                        <td key={field} className="px-4 py-3">
                          <RowPercentInput
                            value={row[field]}
                            onChange={(v) =>
                              updateRow(index, {
                                [field]: clampAgainstCap(row, field, v),
                              })
                            }
                            disabled={row.useDefault}
                            invalid={rowInvalid}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <Switch
                          checked={row.published}
                          onChange={(next) =>
                            updateRow(index, { published: next })
                          }
                          ariaLabel={`Publish commission for ${row.name}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <IncompleteRowsAlert
          rows={rows}
          affiliateCap={affiliateCap}
          sumTiers={sumTiers}
        />
      </section>
    </div>
  );
}

function IncompleteRowsAlert({
  rows,
  affiliateCap,
  sumTiers,
}: {
  rows: CountryRow[];
  affiliateCap: number;
  sumTiers: (tiers: Record<TierField, string>) => number;
}) {
  const incomplete = rows
    .filter((r) => !r.useDefault)
    .map((r) => ({ name: r.name, remaining: affiliateCap - sumTiers(r) }))
    .filter((entry) => entry.remaining > 0);

  if (incomplete.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#ef4444] bg-[#fef2f2] px-3 py-2">
      <p className="text-[13px] font-medium leading-[1.4] tracking-[0.02em] text-[#b42318]">
        {incomplete.length === 1
          ? "1 country has commission remaining to allocate:"
          : `${incomplete.length} countries have commission remaining to allocate:`}
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {incomplete.map((entry) => (
          <li
            key={entry.name}
            className="text-[13px] font-medium leading-[1.4] tracking-[0.02em] text-[#b42318]"
          >
            {entry.name} —{" "}
            <span className="font-semibold">{entry.remaining}%</span> remaining
          </li>
        ))}
      </ul>
    </div>
  );
}

function PercentField({
  label,
  value,
  onChange,
  disabled = false,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]">
        {label}
      </span>
      <span
        className={`flex h-10 w-full items-center gap-2 rounded-lg px-4 text-[15px] font-medium ${
          disabled
            ? "bg-[#eaeaea] text-[#878787]"
            : invalid
              ? "border border-[#ef4444] bg-white text-[#222125]"
              : "bg-[#f4f5f8] text-[#222125]"
        }`}
      >
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          className="h-full flex-1 text-[16px] bg-transparent outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="shrink-0 text-[#878787]">%</span>
      </span>
    </label>
  );
}

function RowPercentInput({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
  invalid: boolean;
}) {
  return (
    <span
      className={`flex h-10 w-full items-center gap-2 rounded-lg px-3 text-[15px] font-medium ${
        disabled
          ? "bg-[#f4f5f8] text-[#878787]"
          : invalid
            ? "border border-[#ef4444] bg-white text-[#222125]"
            : "bg-[#f4f5f8] text-[#222125]"
      }`}
    >
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        className="h-full flex-1 text-[16px] bg-transparent outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="shrink-0 text-[#878787]">%</span>
    </span>
  );
}
