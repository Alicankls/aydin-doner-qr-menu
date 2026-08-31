import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<"button">, "size"> & {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "default" | "lg";
  }
>(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary:
      "bg-aydin-red text-white hover:bg-aydin-red-dark shadow-sm",
    secondary:
      "bg-warm-cream text-charcoal hover:bg-warm-cream/80",
    outline:
      "border border-border-soft bg-transparent hover:bg-warm-cream",
    ghost: "bg-transparent hover:bg-warm-cream",
    destructive:
      "bg-sold-out/10 text-sold-out hover:bg-sold-out/20",
  };
  const sizes = {
    default: "h-11 px-4 py-2",
    lg: "h-12 px-6 py-3 text-base",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
