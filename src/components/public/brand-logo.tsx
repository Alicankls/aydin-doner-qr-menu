import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The brand logo (settings.logoUrl, the same file everywhere) in a white rounded tile,
 * so its red square never melts into a red header or red buttons.
 */
export function BrandLogo({
  src,
  size = 40,
  priority = false,
  className,
}: {
  src: string;
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-[10px] bg-white p-[2px] shadow-sm ring-1 ring-black/10",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={size * 2}
        sizes={`${size}px`}
        priority={priority}
        className="h-full w-full rounded-[8px] object-cover"
      />
    </span>
  );
}
