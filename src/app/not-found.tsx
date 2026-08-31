import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-warm-white px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-aydin-red">404</p>
      <h1 className="font-display text-2xl font-bold text-charcoal">
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="text-secondary-text">
        Sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-11 items-center rounded-full bg-aydin-red px-6 font-semibold text-white transition hover:bg-aydin-red-dark"
      >
        Menüye Dön
      </Link>
    </div>
  );
}
