import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-ink-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-ink-heading" : "text-ink-secondary"}
              >
                {item.label}
              </span>
            )}
            {!isLast ? (
              <ChevronRight
                className="size-4 text-ink-tertiary"
                aria-hidden
              />
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
