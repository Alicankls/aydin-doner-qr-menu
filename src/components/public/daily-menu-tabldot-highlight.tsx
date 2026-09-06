export function DailyMenuTabldotHighlight() {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-aydin-red/20 bg-charcoal shadow-sm sm:mb-10">
      <div className="h-1 bg-aydin-red" aria-hidden="true" />
      <div className="flex flex-col items-center gap-3 px-6 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left">
        <span className="inline-flex w-fit items-center rounded-full border border-aydin-red/60 bg-aydin-red/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.2em] text-warm-cream">
          Tabldot
        </span>
        <p className="flex items-baseline gap-2.5">
          <span className="text-sm font-semibold uppercase tracking-wide text-warm-cream/60">
            4 Çeşit
          </span>
          <span className="text-warm-cream/30" aria-hidden="true">
            ·
          </span>
          <span className="text-xl font-extrabold text-warm-white sm:text-2xl">
            ₺250
          </span>
        </p>
      </div>
    </div>
  );
}
