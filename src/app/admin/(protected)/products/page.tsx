import { getAllProducts } from "@/lib/data/products";
import { ProductsClient } from "@/components/admin/products-client";

export const metadata = {
  title: "Ürünler | Aydın Döner Menü Yönetim",
  description: "Menü ürünlerini yönetin.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductsClient initialProducts={products} />;
}
