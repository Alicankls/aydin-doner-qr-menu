"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
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

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-warm-white text-charcoal">
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
          "fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto border-r border-border-soft bg-warm-white transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border-soft">
          <span className="text-xl font-bold text-aydin-red-dark font-display">
            Menü Yönetim
          </span>
          <button
            className="lg:hidden rounded p-1 text-secondary-text hover:text-charcoal"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-charcoal hover:bg-warm-cream hover:text-aydin-red-dark"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-border-soft px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
            <User className="h-5 w-5 text-secondary-text" />
            <span className="text-charcoal">{user.email}</span>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-charcoal hover:bg-warm-cream hover:text-aydin-red-dark"
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
        <header className="flex h-16 items-center justify-between border-b border-border-soft bg-warm-white px-4 lg:px-6">
          <button
            className="lg:hidden rounded p-2 text-secondary-text hover:text-charcoal"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
