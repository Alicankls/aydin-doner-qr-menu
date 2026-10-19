import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto_Slab } from "next/font/google";
import "./globals.css";

// Body font: Plus Jakarta Sans (clean geometric sans, full Turkish coverage via latin-ext).
const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Aydın Döner | Çorlu",
    template: "%s | Aydın Döner",
  },
  description:
    "Aydın Döner - Çorlu/Tekirdağ'da 10 yılı aşkın süredir hizmet veren aile işletmesi. Döner, günlük tabldot yemekler ve daha fazlası için QR menümüzü inceleyin.",
  openGraph: {
    title: "Aydın Döner | Çorlu",
    description:
      "Çorlu/Tekirdağ'da 10 yılı aşkın süredir hizmet veren aile işletmesi. Döner, günlük tabldot yemekler ve günün menüsü için QR menümüzü inceleyin.",
    siteName: "Aydın Döner",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aydın Döner | Çorlu",
    description:
      "Çorlu/Tekirdağ'da 10 yılı aşkın süredir hizmet veren aile işletmesi. Döner, günlük tabldot yemekler ve günün menüsü için QR menümüzü inceleyin.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${body.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-warm-white text-charcoal">
        {children}
      </body>
    </html>
  );
}
