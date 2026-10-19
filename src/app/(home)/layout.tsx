import type { ReactNode } from "react";
import { Bebas_Neue, Playfair_Display } from "next/font/google";
import "./cinematic.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  preload: true, // hero headline font is fetched with the document, not after CSS
});

// Elegant italic serif, only for the "Hakkımızda" accents. Below the fold, so not preloaded.
const serif = Playfair_Display({
  variable: "--font-serif-italic",
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  weight: ["500", "600"],
  display: "swap",
  preload: false,
});

/**
 * Static-poster fallback: decided before first paint so the page never
 * flashes the animated layout first. Slow link, Save-Data, or reduced motion.
 */
const MODE_SCRIPT = `(function(){try{var c=navigator.connection||{};var slow=/^(slow-2g|2g|3g)$/.test(c.effectiveType||"");var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;if(slow||c.saveData===true||rm){document.getElementById("cine-root").setAttribute("data-mode","static")}}catch(e){}})();`;

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div id="cine-root" className={`${bebas.variable} ${serif.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
      {children}
    </div>
  );
}
