import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";
import { ProductFormWrapper } from "@/components/admin/product-form-wrapper";

export const metadata = {
  title: "Ürünü Düzenle | Aydın Döner Menü Yönetim",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const categories = await getAllCategories({ onlyActive: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal font-display">
          Ürünü Düzenle
        </h1>
        <p className="text-sm text-secondary-text">{product.name}</p>
      </div>
      <ProductFormWrapper product={product} categories={categories} />
    </div>
  );
}
