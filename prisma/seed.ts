import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

function toSlug(value: string) {
  return slugify(value, { lower: true, strict: true, trim: true, locale: "tr" });
}

async function main() {
  console.log("Seed başlıyor...");

  // Admin kullanıcı
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@aydindoner.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "AydinDoner2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin kullanıcı hazır: ${adminEmail}`);

  // Site ayarları
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        businessName: "Aydın Döner",
        tagline: "Yıllardır bildiğiniz lezzet, artık telefonunuzda.",
        phone: "0282 651 00 00",
        whatsapp: "05001234567",
        address: "Sanayi Mahallesi, Çorlu / Tekirdağ",
        workingHours: "Her gün 09:00 - 22:00",
        instagram: "https://instagram.com/aydindoner",
        facebook: "https://facebook.com/aydindoner",
        tiktok: "https://tiktok.com/@aydindoner",
        themeColor: "#B82F3D",
        aboutText:
          "Aydın Döner, 10 yılı aşkın süredir Çorlu'da hizmet veren köklü bir aile işletmesidir. Günlük taze pişen yemeklerimiz ve el yapımı dönerimizle sanayi esnafının ve öğle yemeği arayan herkesin durağı olmaktan gurur duyuyoruz.",
      },
    });
    console.log("Site ayarları oluşturuldu.");
  }

  // Kategoriler
  const categoriesData = [
    { name: "Günün Çorbaları", order: 0 },
    { name: "Ana Yemekler", order: 1 },
    { name: "Döner & Izgara", order: 2 },
    { name: "Pilav & Garnitür", order: 3 },
    { name: "Salata & Mezeler", order: 4 },
    { name: "İçecekler", order: 5 },
    { name: "Tatlılar", order: 6 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const slug = toSlug(cat.name);
    const created = await prisma.category.upsert({
      where: { slug },
      update: { name: cat.name, order: cat.order, isActive: true },
      create: { name: cat.name, slug, order: cat.order, isActive: true },
    });
    categories[cat.name] = created.id;
  }
  console.log("Kategoriler hazır.");

  // Ürünler
  const productsData = [
    {
      name: "Mercimek Çorbası",
      category: "Günün Çorbaları",
      price: 60,
      code: "COR-001",
      shortDescription: "Günlük taze pişen ev usulü mercimek çorbası.",
      longDescription:
        "Kırmızı mercimek, soğan ve tereyağı ile geleneksel usulde pişirilen, üzerine nane ve kırmızı biberli tereyağı gezdirilen mercimek çorbamız.",
      calories: 180,
      allergenInfo: "Gluten, süt ürünleri içerebilir.",
      showInDailyMenu: true,
      sortOrder: 0,
    },
    {
      name: "Ezogelin Çorbası",
      category: "Günün Çorbaları",
      price: 60,
      code: "COR-002",
      shortDescription: "Bulgur ve mercimek ile hazırlanan doyurucu çorba.",
      longDescription:
        "Kırmızı mercimek, bulgur, domates salçası ve nane ile pişirilen geleneksel ezogelin çorbamız.",
      calories: 200,
      allergenInfo: "Gluten içerir.",
      showInDailyMenu: false,
      sortOrder: 1,
    },
    {
      name: "Tas Kebabı",
      category: "Ana Yemekler",
      price: 220,
      code: "ANA-001",
      shortDescription: "Kendi suyunda pişmiş yumuşacık kuşbaşı et.",
      longDescription:
        "Günlük taze dana kuşbaşı etin, soğan, biber ve domates ile birlikte kendi suyunda uzun süre pişirilmesiyle hazırlanan ev usulü tas kebabımız. Pirinç pilavı ile servis edilir.",
      calories: 420,
      allergenInfo: "İçermez.",
      showInDailyMenu: true,
      sortOrder: 0,
    },
    {
      name: "Karnıyarık",
      category: "Ana Yemekler",
      price: 190,
      code: "ANA-002",
      shortDescription: "Kıymalı patlıcan, günlük hazırlanan ev yemeği.",
      longDescription:
        "Közlenmiş patlıcanların kıyma, soğan, biber ve domates harcıyla doldurulup fırınlanmasıyla hazırlanan klasik karnıyarığımız.",
      calories: 380,
      allergenInfo: "İçermez.",
      showInDailyMenu: true,
      sortOrder: 1,
    },
    {
      name: "Kuru Fasulye",
      category: "Ana Yemekler",
      price: 150,
      code: "ANA-003",
      shortDescription: "Etli, günlük pişen kuru fasulye.",
      longDescription:
        "Kuşbaşı et parçalarıyla zenginleştirilmiş, geleneksel tarif ile pişirilen kuru fasulyemiz pirinç pilavı ile birlikte servis edilir.",
      calories: 350,
      allergenInfo: "İçermez.",
      showInDailyMenu: false,
      sortOrder: 2,
    },
    {
      name: "Tavuk Döner Porsiyon",
      category: "Döner & Izgara",
      price: 170,
      code: "DON-001",
      shortDescription: "Özel baharatlarla marine edilmiş tavuk döner.",
      longDescription:
        "Kendi marinasyonumuzla hazırladığımız tavuk dönerimiz, közlenmiş sebzeler ve pilavla birlikte servis edilir.",
      calories: 480,
      allergenInfo: "Süt ürünleri içerebilir.",
      showInDailyMenu: false,
      sortOrder: 0,
    },
    {
      name: "Et Döner Porsiyon",
      category: "Döner & Izgara",
      price: 210,
      code: "DON-002",
      shortDescription: "El yapımı geleneksel et döner.",
      longDescription:
        "10 yılı aşkın tecrübemizle hazırladığımız et dönerimiz; ince dilimlenmiş, közlenmiş domates ve biber eşliğinde sunulur.",
      calories: 550,
      allergenInfo: "İçermez.",
      showInDailyMenu: false,
      isSoldOut: true,
      sortOrder: 1,
    },
    {
      name: "Adana Kebap",
      category: "Döner & Izgara",
      price: 230,
      code: "DON-003",
      shortDescription: "Acılı, elde çekilmiş kuzu eti kebabı.",
      longDescription:
        "Elde çekilen kuzu kıymasının özel baharatlarla yoğrulup mangalda pişirilmesiyle hazırlanan Adana kebabımız lavaş ve közlenmiş sebze eşliğinde servis edilir.",
      calories: 600,
      allergenInfo: "Gluten içerir (lavaş).",
      showInDailyMenu: false,
      sortOrder: 2,
    },
    {
      name: "Pirinç Pilavı",
      category: "Pilav & Garnitür",
      price: 50,
      code: "GAR-001",
      shortDescription: "Tereyağlı, günlük pişen pirinç pilavı.",
      longDescription: "Tel şehriyeli, tereyağı ile hazırlanan klasik pirinç pilavımız.",
      calories: 220,
      allergenInfo: "Süt ürünleri içerir.",
      showInDailyMenu: true,
      sortOrder: 0,
    },
    {
      name: "Bulgur Pilavı",
      category: "Pilav & Garnitür",
      price: 45,
      code: "GAR-002",
      shortDescription: "Domatesli, doyurucu bulgur pilavı.",
      longDescription: "İnce bulgur ve domates salçasıyla hazırlanan geleneksel bulgur pilavımız.",
      calories: 210,
      allergenInfo: "Gluten içerir.",
      showInDailyMenu: false,
      sortOrder: 1,
    },
    {
      name: "Cacık",
      category: "Salata & Mezeler",
      price: 40,
      code: "SAL-001",
      shortDescription: "Ev yapımı yoğurt ve taze nane ile.",
      longDescription: "Süzme yoğurt, salatalık, sarımsak ve taze nane ile hazırlanan ev usulü cacığımız.",
      calories: 90,
      allergenInfo: "Süt ürünleri içerir.",
      showInDailyMenu: true,
      sortOrder: 0,
    },
    {
      name: "Çoban Salata",
      category: "Salata & Mezeler",
      price: 55,
      code: "SAL-002",
      shortDescription: "Mevsim sebzelerinden taze salata.",
      longDescription: "Domates, salatalık, soğan, biber ve maydanoz ile hazırlanan taze çoban salatamız.",
      calories: 70,
      allergenInfo: "İçermez.",
      showInDailyMenu: false,
      sortOrder: 1,
    },
    {
      name: "Ayran",
      category: "İçecekler",
      price: 25,
      code: "ICE-001",
      shortDescription: "Ev yapımı, taze köpüklü ayran.",
      longDescription: "Günlük hazırlanan yoğurttan yapılan, doğal ve köpüklü ayranımız.",
      calories: 60,
      allergenInfo: "Süt ürünleri içerir.",
      showInDailyMenu: false,
      sortOrder: 0,
    },
    {
      name: "Çay",
      category: "İçecekler",
      price: 15,
      code: "ICE-002",
      shortDescription: "Demleme çay.",
      longDescription: "İnce belli bardakta servis edilen taze demlenmiş çayımız.",
      calories: 2,
      allergenInfo: "İçermez.",
      showInDailyMenu: false,
      sortOrder: 1,
    },
    {
      name: "Kazandibi",
      category: "Tatlılar",
      price: 70,
      code: "TAT-001",
      shortDescription: "Günlük hazırlanan geleneksel süt tatlısı.",
      longDescription: "Sütlü tatlı geleneğimizin en sevilenlerinden kazandibimiz, karamelize alt tabakasıyla servis edilir.",
      calories: 320,
      allergenInfo: "Süt ürünleri, gluten içerir.",
      showInDailyMenu: false,
      sortOrder: 0,
    },
  ];

  for (const p of productsData) {
    const slug = toSlug(p.name);
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: p.name,
        price: p.price,
        code: p.code,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        calories: p.calories,
        allergenInfo: p.allergenInfo,
        showInDailyMenu: p.showInDailyMenu,
        isSoldOut: p.isSoldOut ?? false,
        sortOrder: p.sortOrder,
        categoryId: categories[p.category],
        isActive: true,
      },
      create: {
        name: p.name,
        slug,
        price: p.price,
        code: p.code,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        calories: p.calories,
        allergenInfo: p.allergenInfo,
        showInDailyMenu: p.showInDailyMenu,
        isSoldOut: p.isSoldOut ?? false,
        sortOrder: p.sortOrder,
        categoryId: categories[p.category],
        isActive: true,
      },
    });
  }
  console.log(`${productsData.length} ürün hazır.`);

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
