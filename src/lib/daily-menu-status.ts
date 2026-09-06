const AUTO_SOLD_OUT_HOUR = 16;
const AUTO_SOLD_OUT_MINUTE = 30;

function getIstanbulHourMinute(date: Date): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return { hour, minute };
}

/**
 * Europe/Istanbul takvim gününü "YYYY-MM-DD" olarak döner. Locale'e bağlı
 * bir string formatına güvenmek yerine formatToParts() ile deterministik
 * üretir (getIstanbulHourMinute ile aynı desen).
 */
export function getIstanbulDateKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value ?? "0000";
  const month = parts.find((p) => p.type === "month")?.value ?? "00";
  const day = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${year}-${month}-${day}`;
}

/**
 * Europe/Istanbul saatine göre, günün 16:30'unu (dahil) geçip geçmediğini
 * söyler. Sunucunun local timezone'una veya UTC'ye güvenmez — Intl ile
 * açıkça "Europe/Istanbul" saatini hesaplar.
 */
export function isDailyMenuAutoSoldOutActive(date: Date = new Date()): boolean {
  const { hour, minute } = getIstanbulHourMinute(date);
  return hour > AUTO_SOLD_OUT_HOUR || (hour === AUTO_SOLD_OUT_HOUR && minute >= AUTO_SOLD_OUT_MINUTE);
}

/**
 * Günün Menüsü gösterimleri için, 16:30'dan sonra showInDailyMenu=true olan
 * tüm ürünleri görüntüde Tükendi gibi işaretler. Veritabanındaki gerçek
 * isSoldOut alanını değiştirmez — sadece render için yeni obje döner, bu
 * yüzden aynı ürün normal kategori sayfasında (bu fonksiyondan geçmeyen
 * listelerde) etkilenmez.
 *
 * dailyMenuOverrideDate, admin'in bugün için bilinçli olarak bu kuralı
 * override ettiğini gösterir (bkz. setDailyMenuSoldOutAction) — bugünün
 * Europe/Istanbul tarihiyle eşleşiyorsa otomatik Tükendi o ürün için
 * atlanır.
 */
export function withDailyMenuAutoSoldOut<
  T extends {
    isSoldOut: boolean;
    showInDailyMenu: boolean;
    dailyMenuOverrideDate: string | null;
  },
>(products: T[]): T[] {
  if (!isDailyMenuAutoSoldOutActive()) return products;
  const today = getIstanbulDateKey();
  return products.map((product) =>
    product.showInDailyMenu &&
    !product.isSoldOut &&
    product.dailyMenuOverrideDate !== today
      ? { ...product, isSoldOut: true }
      : product
  );
}
