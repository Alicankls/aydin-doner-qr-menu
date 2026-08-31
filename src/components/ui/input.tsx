import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "w-full rounded-lg border border-border-soft bg-white px-4 py-2.5 text-sm text-charcoal placeholder-secondary-text/50 focus:border-aydin-red focus:outline-none focus:ring-1 focus:ring-aydin-red",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
