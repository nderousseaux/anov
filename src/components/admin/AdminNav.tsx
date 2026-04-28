'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, CalendarDays } from 'lucide-react';

const navLinks = [
  { href: '/admin/reservation', label: 'Réservations', icon: CalendarDays },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <header
      className="sticky top-0 z-20 bg-card border-b border-primary/20 px-6 py-3 flex items-center gap-6"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Logo */}
      <span
        className="text-xl font-semibold text-primary mr-2 shrink-0"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ANØV
      </span>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${active
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
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
        <LogOut size={15} className="mr-1.5" />
        Se déconnecter
      </Button>
    </header>
  );
}
