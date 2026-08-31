import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Switch = forwardRef<
  HTMLLabelElement,
  Omit<React.ComponentPropsWithoutRef<"label">, "onChange"> & {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
>(({ className, checked, onChange, ...props }, ref) => {
  const id = `switch-${Math.random().toString(36).slice(2)}`;
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        checked ? "bg-aydin-red" : "bg-border-soft",
        className
      )}
      ref={ref}
      {...props}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </label>
  );
});
Switch.displayName = "Switch";
