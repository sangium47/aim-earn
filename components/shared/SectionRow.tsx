type SectionRowProps = {
  title: string;
  hint?: string;
  footnote?: string;
  titleClassName?: string;
  children: React.ReactNode;
};

export function SectionRow({
  title,
  hint,
  footnote,
  titleClassName,
  children,
}: SectionRowProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-start w-full">
      <div className="flex shrink-0 flex-col gap-2 md:w-[371px]">
        <h3
          className={
            titleClassName ??
            "text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]"
          }
        >
          {title}
        </h3>
        {hint ? (
          <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
            {hint}
          </p>
        ) : null}
        {footnote ? (
          <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-[#5f5f5f]">
            {footnote}
          </p>
        ) : null}
      </div>
      <div className="flex flex-1 min-w-0 flex-col items-start">{children}</div>
    </div>
  );
}
