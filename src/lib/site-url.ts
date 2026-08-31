/**
 * Resolves an absolute site URL once NEXT_PUBLIC_SITE_URL is configured
 * (domain not decided yet); falls back to a relative path until then.
 */
export function getSiteUrl(path: string = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
  return `${base}${path}`;
}
