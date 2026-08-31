import { notFound } from "next/navigation";
import { Soup } from "lucide-react";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getActiveProductsByCategorySlug } from "@/lib/data/products";
import { ProductCard } from "@/components/public/product-card";
import { EmptyState } from "@/components/public/empty-state";
import { BreadcrumbJsonLd } from "@/components/public/breadcrumb-json-ld";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) {
    return { title: "Kategori Bulunamadı" };
  }
  return {
    title: category.name,
    description: `${category.name} kategorisindeki tüm ürünleri inceleyin. Aydın Döner - Çorlu/Tekirdağ'da döner ve günlük ev yemekleri.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();

  const products = await getActiveProductsByCategorySlug(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", path: getSiteUrl("/") },
          { name: category.name, path: getSiteUrl(`/kategori/${category.slug}`) },
        ]}
      />
      <p className="text-xs font-bold uppercase tracking-widest text-aydin-red">Kategori</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
        {category.name}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <EmptyState
          className="mt-6"
          icon={<Soup className="h-10 w-10" />}
          title="Bu kategoride şu anda ürün bulunmuyor."
          description="Diğer kategorilerimize göz atabilir veya günün menüsünü inceleyebilirsiniz."
        />
      )}
    </div>
  );
}
