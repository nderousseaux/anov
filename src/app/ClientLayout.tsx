'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/app/components/ui/sonner';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { SplashScreen } from '@/app/components/SplashScreen';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [showSplash, setShowSplash] = useState(!isAdmin);
  const [isSplashFading, setIsSplashFading] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    const fadeTimer = window.setTimeout(() => {
      setIsSplashFading(true);
    }, 1500);

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [showSplash]);

  if (isAdmin) {
    return (
      <>
        <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          {children}
        </div>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
        <Navbar />

        <main>{children}</main>

        <Footer />

        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </div>

      {showSplash && <SplashScreen isFading={isSplashFading} />}
    </>
  );
}
