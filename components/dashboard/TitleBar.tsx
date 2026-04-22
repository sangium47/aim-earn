import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SelectPillProps = {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

function SelectPill({ options, defaultValue, onChange }: SelectPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options[0],
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full md:w-48 h-10 items-center justify-between gap-6 rounded-lg border border-[#cacaca] bg-white pl-4 pr-3 py-3 text-base font-medium tracking-[0.02em] text-[#222125] hover:border-[#b5b5b5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b1610c] focus-visible:ring-offset-2"
      >
        <span>{selectedValue}</span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 z-10 w-full max-w-48 rounded-lg border border-[#e7e7e7] bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 text-left text-base tracking-[0.02em] text-[#222125] hover:bg-[#f5f5f5] first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TitleBar() {
  return (
    <section className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center">
        <span className="py-0.5 text-base font-medium tracking-[0.02em] text-[#1e1e1e]">
          Dashboard
        </span>
      </nav>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-4">
          {/* Title */}
          <h1 className="flex-1 text-[24px] md:text-[32px] font-medium leading-[1.2] tracking-[0.01em] text-[#1e1e1e]">
            Dashboard
          </h1>

          {/* Time period selector */}
          <SelectPill
            options={[
              "Last 7 days",
              "Last 30 days",
              "Last 90 days",
              "Last 12 months",
              "All time",
            ]}
            defaultValue="Last 7 days"
            onChange={(value) => console.log("Selected time period:", value)}
          />
        </div>
        <p className="truncate text-sm font-medium tracking-[0.02em] text-[#767676]">
          * The displayed total is not final and will be converted based on the
          local exchange rate.
        </p>
      </div>
    </section>
  );
}
