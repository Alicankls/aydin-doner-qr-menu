const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function parseDailyHours(workingHours: string | null) {
  if (!workingHours) return null;
  const match = workingHours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  return { opens: match[1], closes: match[2] };
}

export function RestaurantJsonLd({
  settings,
}: {
  settings: {
    businessName: string;
    phone: string | null;
    address: string | null;
    workingHours: string | null;
  };
}) {
  const hours = parseDailyHours(settings.workingHours);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.businessName,
    servesCuisine: ["Turkish", "Döner", "Kebap"],
    priceRange: "₺₺",
  };

  if (settings.phone) jsonLd.telephone = settings.phone;

  if (settings.address) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Çorlu",
      addressRegion: "Tekirdağ",
      addressCountry: "TR",
    };
  }

  if (hours) {
    jsonLd.openingHoursSpecification = {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: WEEKDAYS,
      opens: hours.opens,
      closes: hours.closes,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
