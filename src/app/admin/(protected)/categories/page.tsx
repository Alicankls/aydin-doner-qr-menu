import { getAllCategoriesWithProductCount } from "@/lib/data/categories";
import { CategoriesClient } from "@/components/admin/categories-client";

export const metadata = {
  title: "Kategoriler | Aydın Döner Menü Yönetim",
  description: "Menü kategorilerini yönetin.",
};

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithProductCount();
  return <CategoriesClient initialCategories={categories} />;
}
