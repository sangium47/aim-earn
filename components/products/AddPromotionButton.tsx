import type { ButtonHTMLAttributes } from "react";
import { PlusIcon } from "@/components/icons";

type AddPromotionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Override the default "Add Promotion" label. */
  label?: string;
};

/**
 * Dashed-border "Add Promotion" CTA (Figma node 4020:27361).
 *
 * Renders as a full-width button, 78px tall, dashed #c1c1c1 border,
 * with a plus icon and label centered inside.
 */
export function AddPromotionButton({
  label = "Add Promotion",
  className = "",
  type = "button",
  ...rest
}: AddPromotionButtonProps) {
  return (
    <button
      type={type}
      className={`flex h-[78px] w-full items-center justify-center gap-4 rounded-lg border border-dashed border-[#c1c1c1] bg-transparent px-6 py-8 text-[15px] font-medium leading-none tracking-[0.3px] text-[#222125] transition-colors hover:border-[#878787] hover:bg-[#f4f5f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237] focus-visible:ring-offset-2 ${className}`}
      {...rest}
    >
      <PlusIcon />
      <span>{label}</span>
    </button>
  );
}

export default AddPromotionButton;
