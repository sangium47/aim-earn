"use client";

import { usePathname, useRouter } from "next/navigation";

type BecomeDistributorHeroProps = {
  onApply?: () => void;
};

export function BecomeDistributorHero({ onApply }: BecomeDistributorHeroProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleApply = () => {
    if (onApply) {
      onApply();
      return;
    }
    router.push(
      `/register-distributor?page=${encodeURIComponent(pathname ?? "/")}`,
    );
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-32 rounded-2xl md:rounded-3xl bg-[#2c2c2c] p-6 md:px-10 md:py-16 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
      <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-6">
        <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[0.02em] text-[#f5f5f5]">
          Become a Distributor
        </h2>
        <p className="text-sm md:text-base font-medium leading-[1.4] tracking-[0.02em] text-[#f5f5f5]">
          If you would like to become a distributor, simply sign up here and
          select the country you wish to join.
        </p>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="inline-flex h-10 md:h-auto w-full md:w-[154px] shrink-0 items-center justify-center gap-2 rounded-lg bg-white p-3 text-[15px] font-medium leading-none tracking-[0.02em] text-[#222125] hover:bg-[#f5f5f5]"
      >
        Apply Now
      </button>
    </div>
  );
}

export default BecomeDistributorHero;
