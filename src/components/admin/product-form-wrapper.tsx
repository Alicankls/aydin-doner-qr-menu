"use client";

import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/components/ui/toast";
import {
  ProductForm,
  type AdminProduct,
} from "@/components/admin/product-form";
import type { ProductFormState } from "@/actions/products";

export function ProductFormWrapper({
  product,
  categories,
}: {
  product?: AdminProduct;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();

  return (
    <ToastProvider>
      <Inner product={product} categories={categories} router={router} />
    </ToastProvider>
  );
}

function Inner({
  product,
  categories,
  router,
}: {
  product?: AdminProduct;
  categories: { id: string; name: string }[];
  router: ReturnType<typeof useRouter>;
}) {
  const { addToast } = useToast();

  const handleSaved = (result: ProductFormState) => {
    if (result.status === "ok") {
      addToast(product ? "Ürün güncellendi." : "Ürün oluşturuldu.", "success");
      router.push("/admin/products");
    } else {
      addToast(result.message ?? "Bir hata oluştu.", "error");
    }
  };

  return (
    <ProductForm
      key={product?.id ?? "new"}
      product={product}
      categories={categories}
      onSaved={handleSaved}
    />
  );
}
