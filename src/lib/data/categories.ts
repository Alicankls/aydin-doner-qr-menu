import { prisma } from "@/lib/prisma";

export function getAllCategories(options?: { onlyActive?: boolean }) {
  return prisma.category.findMany({
    where: options?.onlyActive ? { isActive: true } : undefined,
    orderBy: { order: "asc" },
  });
}

export function getAllCategoriesWithProductCount() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getActiveCategoriesWithActiveProducts() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}