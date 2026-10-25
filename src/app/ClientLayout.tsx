"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { LanguageProvider } from "@/context/LanguageContext";

export default function ClientLayout({
  children,
  footerContent,
  isStaging,
}: {
  children: ReactNode;
  footerContent?: Record<string, unknown> | null;
  isStaging?: boolean;
}) {
  return (
    <LanguageProvider>
      <ClientLayoutInner footerContent={footerContent} isStaging={isStaging}>
        {children}
      </ClientLayoutInner>
    </LanguageProvider>
  );
}

function ClientLayoutInner({
  children,
  footerContent,
  isStaging,
}: {
  children: ReactNode;
  footerContent?: Record<string, unknown> | null;
  isStaging?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/keystatic");

  // Pages où le splash screen ne doit pas s'afficher
  const noSplashPages = [
    "/cheques-cadeaux/succes",
    "/cheques-cadeaux",
    "/reservation/succes",
    "/reservation/paiement",
    "/reservation/cancel",
  ];
  const shouldShowSplash =
    !isAdmin && !noSplashPages.some((page) => pathname.startsWith(page));

  const [showSplash, setShowSplash] = useState(shouldShowSplash);
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
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar footerContent={footerContent} />

        <main>{children}</main>

        <Footer content={footerContent} />

        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </div>

      {showSplash && <SplashScreen isFading={isSplashFading} />}

      {isStaging && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-amber-600 text-white text-center py-3 text-sm z-50"
          aria-label="Environnement staging"
        >
          <span>Environnement de test (staging)</span>
        </div>
      )}
    </>
  );
}
