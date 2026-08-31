import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border-soft bg-warm-cream/50 p-10 text-center",
        className
      )}
    >
      {icon && <div className="mb-3 flex justify-center text-border-soft">{icon}</div>}
      <p className="font-display text-lg font-bold text-charcoal">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-secondary-text">{description}</p>
      )}
    </div>
  );
}
