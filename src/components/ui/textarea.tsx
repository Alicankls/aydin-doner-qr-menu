import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "w-full min-h-[100px] rounded-lg border border-border-soft bg-white px-4 py-2.5 text-sm text-charcoal placeholder-secondary-text/50 focus:border-aydin-red focus:outline-none focus:ring-1 focus:ring-aydin-red",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
