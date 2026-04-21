type StatCardProps = {
  label: string;
  value: string;
};

/**
 * The grey metric tile used in the AgentLists header strip.
 * bg #f5f5f5 / border #cecece / rounded-lg / 16px padding.
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex md:flex-1 md:min-w-[160px] flex-col md:gap-2 rounded-lg border border-[#cecece] bg-[#f5f5f5] p-1.5 md:p-3">
      <p className="text-xs md:text-[14px] font-semibold md:leading-[1.4] tracking-[0.28px] text-[#434343]">
        {label}
      </p>
      <p className="text-base md:text-[24px] font-medium leading-[1.2] tracking-[0.48px] text-[#434343]">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
