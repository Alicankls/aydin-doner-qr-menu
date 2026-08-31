"use client";

import { createContext, useContext, type ReactNode } from "react";

type Settings = {
  businessName: string;
  tagline: string | null;
  logoUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  workingHours: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const SiteContext = createContext<{
  settings: Settings;
  categories: Category[];
} | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider.");
  return ctx;
}

export function SiteProvider({
  settings,
  categories,
  children,
}: {
  settings: Settings;
  categories: Category[];
  children: ReactNode;
}) {
  return (
    <SiteContext.Provider value={{ settings, categories }}>
      <div className="flex min-h-screen flex-col bg-warm-white text-charcoal">
        <main className="flex-1">{children}</main>
      </div>
    </SiteContext.Provider>
  );
}
