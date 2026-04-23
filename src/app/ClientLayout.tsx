'use client';

import React, { useEffect, useState } from 'react';
import { Toaster } from '@/app/components/ui/sonner';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { SplashScreen } from '@/app/components/SplashScreen';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
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
