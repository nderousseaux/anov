"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  CalendarDays,
  FileText,
  Gift,
  Users,
  Package,
} from "lucide-react";

const navLinks = [
  { href: "/admin/reservation", label: "Réservations", icon: CalendarDays },
  { href: "/admin/cheques-cadeaux", label: "Bons Cadeaux", icon: Gift },
  { href: "/admin/commandes", label: "Commandes", icon: Package },
  { href: "/admin/clients", label: "Fiches Client", icon: Users },
  {
    href: "/admin/cms",
    label: "CMS",
    icon: FileText,
    activeFor: ["/admin/cms", "/keystatic"],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-card border-b border-primary/20 px-6 py-3 flex items-center gap-6">
      {/* Logo */}
      <span
        className="text-xl font-semibold text-primary mr-2 shrink-0"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ANØV
      </span>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map(({ href, label, icon: Icon, activeFor }) => {
          const active = (activeFor ?? [href]).some((p) =>
            pathname.startsWith(p),
          );
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                active
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-muted-foreground hover:text-foreground shrink-0"
      >
        <LogOut size={15} className="md:mr-1.5" />
        <span className="hidden md:inline">Se déconnecter</span>
      </Button>
    </header>
  );
}
