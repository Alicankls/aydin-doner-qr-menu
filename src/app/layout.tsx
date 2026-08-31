import type { Metadata } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
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
      className={`${inter.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-warm-white text-charcoal">
        {children}
      </body>
    </html>
  );
}
