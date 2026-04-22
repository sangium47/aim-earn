import { MegaphoneIcon, TrashIcon } from "@/components/icons";
import type { Promotion } from "@/components/type";

type PromotionRowProps = {
  promotion: Promotion;
  onDelete?: (promotion: Promotion) => void;
};

/**
 * One promotion entry: a yellow icon tile, name + description, and a
 * trailing trash icon button. Matches Figma node 137:52526.
 *
 * The description is clamped to two lines using a fixed 46px height +
 * `line-clamp-2` fallback — matches the Figma treatment.
 */
export function PromotionRow({ promotion, onDelete }: PromotionRowProps) {
  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
        <div className="flex size-[80px] md:size-[114px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f8d237] text-white">
          {promotion.icon ?? <MegaphoneIcon />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-2">
          <p className="text-[12px] md:text-[15px] font-medium leading-none tracking-[0.3px] text-[#1e1e1e]">
            {promotion.name}
          </p>
          <p className="line-clamp-3 min-h-[60px] flex-1 overflow-auto text-[11px] md:text-[14px] font-medium leading-[1.2] tracking-[0.28px] text-[#5f5f5f]">
            {promotion.description}
          </p>
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            // Prevent row `onClick` from firing when the delete icon is hit.
            event.stopPropagation();
            onDelete(promotion);
          }}
          aria-label="Download"
          className={[
            "inline-flex size-9 items-center justify-center rounded-lg transition-colors",
            "border-[#c1c1c1] text-[#222125] hover:bg-[#f4f5f8]",
          ].join(" ")}
        >
          <TrashIcon />
        </button>
      )}
    </>
  );

  const baseClasses =
    "flex w-full items-start justify-between gap-2 md:gap-4 rounded-2xl bg-[#f4f5f8] p-2 md:p-4 text-left";

  return <div className={baseClasses}>{content}</div>;
}

export default PromotionRow;
