"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Tags,Package, CalendarDays, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Kategoriler", icon: Tags },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/daily-menu", label: "Günün Menüsü", icon: CalendarDays },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
];

type AdminUser = { email: string; role: string };

export function AdminClientShell({
  user,
  children,
}: {
  user: AdminUser;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-warm-cream text-charcoal">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-charcoal transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-warm-cream/10">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border border-warm-cream/25">
            <Image
              src="/uploads/logo/aydin-doner-logo.png"
              alt="Aydın Döner"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <button
            className="lg:hidden rounded p-1 text-warm-cream/60 hover:text-warm-cream"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-aydin-red text-warm-cream"
                    : "text-warm-cream/75 hover:bg-warm-cream/10 hover:text-warm-cream"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-warm-cream/10 px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
            <User className="h-5 w-5 text-warm-cream/50" />
            <span className="text-warm-cream/80">{user.email}</span>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-warm-cream/75 hover:bg-warm-cream/10 hover:text-warm-cream"
            >
              <LogOut className="h-5 w-5" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border-soft bg-warm-cream px-4 lg:px-6">
          <button
            className="lg:hidden rounded p-2 text-secondary-text hover:text-charcoal"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-warm-cream p-6">{children}</main>
      </div>
    </div>
  );
}
