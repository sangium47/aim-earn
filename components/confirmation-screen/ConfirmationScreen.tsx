import type { ReactNode } from "react";
import { CheckCircleIcon } from "@/components/icons";

export type ConfirmationScreenProps = {
  /** Main heading. Defaults to the Figma source's copy. */
  title?: string;
  /** Body copy — accepts ReactNode so callers can embed `<br />`, `<strong>`, etc. */
  description: ReactNode;
  /** Override the default check-circle icon. */
  icon?: ReactNode;
  /** Optional slot for action buttons (e.g. "Open email app", "Resend"). */
  action?: ReactNode;
  className?: string;
};

/**
 * Generic success-state screen.
 *
 * Source: Figma node 137:56265 ("Add more Country_Confirmation"). The Figma
 * frame shows a confirmation email flow, but the component is deliberately
 * generic — pass any `title` + `description` to reuse for password-reset
 * confirmations, email-change confirmations, "order placed" states, etc.
 *
 * Server component: purely presentational, no state, no event handlers.
 */
export function ConfirmationScreen({
  title = "Confirmation Email Sent",
  description,
  icon,
  action,
  className,
}: ConfirmationScreenProps) {
  return (
    <section
      className={["w-full bg-surface-card", className ?? ""].join(" ")}
      aria-labelledby="confirmation-heading"
    >
      <div className="flex min-h-[840px] flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
        <div className="text-ink" aria-hidden="true">
          {icon ?? <CheckCircleIcon className="h-[88px] w-[88px]" />}
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
          <h1
            id="confirmation-heading"
            className="max-w-[480px] text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
          >
            {title}
          </h1>
          <p className="max-w-[560px] text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
            {description}
          </p>
        </div>

        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </section>
  );
}
