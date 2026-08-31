# Aydın Döner — QR Menü & Admin Panel

Çorlu/Tekirdağ'da hizmet veren Aydın Döner için QR kod ile erişilen bir müşteri menüsü ve işletme sahibinin kullandığı bir admin panel.

## Teknolojiler

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma + SQLite
- Zod, React Hook Form
- JWT tabanlı özel admin oturum sistemi (`jose`)

## Kurulum

```bash
npm install
cp .env.example .env   # gerekli değerleri doldur
npm run prisma:generate
npm run db:push
npm run db:seed         # admin kullanıcı + örnek veri oluşturur
npm run dev
```

- Müşteri menüsü: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (`.env`'deki `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile giriş yapılır)

## Komutlar

```bash
npm run dev             # geliştirme sunucusu (Turbopack)
npm run build           # production build
npm run start           # production build'i çalıştırır
npm run lint            # eslint

npm run prisma:generate # Prisma client'ı yeniden üretir
npm run db:push         # şemayı SQLite'a uygular
npm run db:seed         # admin kullanıcı + örnek veri ekler
npm run db:reset        # veritabanını sıfırlar ve yeniden seed'ler
```

## Yapı

- `src/app/(public)/` — müşteri menüsü (ana sayfa, kategori/ürün sayfaları, hakkımızda, iletişim)
- `src/app/admin/` — admin panel (dashboard, kategoriler, ürünler, günün menüsü, ayarlar)
- `src/lib/data/` — okuma sorguları · `src/actions/` — yazma işlemleri (Server Actions)
- `prisma/schema.prisma` — veri modeli (Category, Product, SiteSettings, AdminUser)

Daha fazla mimari detay için `CLAUDE.md` dosyasına bakın.
