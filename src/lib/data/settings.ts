import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) return settings;
  return prisma.siteSettings.create({ data: {} });
}
