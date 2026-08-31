import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "soldout"
  | "daily"
  | "active"
  | "inactive";

export const Badge = forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span"> & { variant?: BadgeVariant }
>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-secondary-text/10 text-secondary-text",
    secondary: "bg-warm-cream text-aydin-red-dark",
    soldout: "bg-sold-out text-white",
    daily: "bg-aydin-red text-white",
    active: "bg-aydin-red/10 text-aydin-red-dark",
    inactive: "bg-border-soft text-secondary-text",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export const CloseButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <button
    type="button"
    className={cn(
      "absolute right-4 top-4 rounded-md p-1 text-secondary-text/60 opacity-70 hover:text-charcoal hover:opacity-100",
      className
    )}
    ref={ref}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
CloseButton.displayName = "CloseButton";
