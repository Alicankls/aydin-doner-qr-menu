import type { ReactNode } from "react";

export const metadata = {
  title: "Giriş | Aydın Döner Menü Yönetim",
  description: "Aydın Döner menü yönetim paneline giriş yapın.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
