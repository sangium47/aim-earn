import type { CountryCommission } from "@/components/type";

type CountryCommissionRowProps = {
  data: CountryCommission;
};

/**
 * One row representing a country's commission breakdown: country label
 * on the left, 4 stat tiles on the right. Each tile is label + value.
 *
 * Responsive: on narrow screens the tiles wrap below the country label
 * rather than crushing against each other.
 */
export function CountryCommissionRow({ data }: CountryCommissionRowProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#f4f5f8] p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full items-center md:w-[283px]">
        <h3 className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
          {data.country}
        </h3>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
        {data.tiers.map((tier) => (
          <div
            key={tier.label}
            className="flex min-w-[140px] flex-1 items-center justify-between rounded-lg bg-white p-4"
          >
            <p className="font-inter text-[14px] font-medium leading-5 tracking-[-0.15px] text-[#1e1e1e]">
              {tier.label}
            </p>
            <p className="text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
              {tier.percent}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryCommissionRow;
