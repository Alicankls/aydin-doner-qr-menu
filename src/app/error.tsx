"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-warm-white px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-aydin-red">Hata</p>
      <h1 className="font-display text-2xl font-bold text-charcoal">
        Bir şeyler ters gitti
      </h1>
      <p className="text-secondary-text">
        Sayfa yüklenirken beklenmedik bir sorun oluştu. Lütfen tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="mt-2 inline-flex h-11 items-center rounded-full bg-aydin-red px-6 font-semibold text-white transition hover:bg-aydin-red-dark"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
