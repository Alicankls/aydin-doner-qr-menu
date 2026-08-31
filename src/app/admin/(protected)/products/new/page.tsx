import { getAllCategories } from "@/lib/data/categories";
import { ProductFormWrapper } from "@/components/admin/product-form-wrapper";

export const metadata = {
  title: "Yeni Ürün | Aydın Döner Menü Yönetim",
};

export default async function NewProductPage() {
  const categories = await getAllCategories({ onlyActive: true });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal font-display">Yeni Ürün</h1>
        <p className="text-sm text-secondary-text">
          Menüye eklenecek yeni ürünün bilgilerini doldurun.
        </p>
      </div>
      <ProductFormWrapper categories={categories} />
    </div>
  );
}
