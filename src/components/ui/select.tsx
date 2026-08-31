import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(({ className, ...props }, ref) => (
  <select
    className={cn(
      "w-full appearance-none rounded-lg border border-border-soft bg-white px-4 py-2.5 text-sm text-charcoal focus:border-aydin-red focus:outline-none focus:ring-1 focus:ring-aydin-red",
      className
    )}
    ref={ref}
    {...props}
  />
));
Select.displayName = "Select";
