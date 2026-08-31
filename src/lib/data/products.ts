import { prisma } from "@/lib/prisma";

export function getAllProducts() {
  return prisma.product.findMany({
    orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    include: { category: true },
  });
}

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export function getActiveProductsByCategorySlug(categorySlug: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug, isActive: true },
    },
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });
}

export function getDailyMenuProducts() {
  return prisma.product.findMany({
    where: { isActive: true, showInDailyMenu: true },
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });
}

export function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      NOT: { id: excludeId },
    },
    orderBy: { sortOrder: "asc" },
    take: 5,
    include: { category: true },
  });
}