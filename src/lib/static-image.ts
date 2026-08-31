import { existsSync } from "fs";
import { join } from "path";

/**
 * Returns the public URL for an optional static decorative image (e.g. under
 * public/images/), or null if the file hasn't been provided yet. Lets pages
 * reference not-yet-uploaded brand imagery without rendering a broken <img>.
 */
export function getStaticImage(publicRelativePath: string): string | null {
  const abs = join(process.cwd(), "public", publicRelativePath);
  return existsSync(abs) ? `/${publicRelativePath.replace(/^\/+/, "")}` : null;
}
