import React from 'react';

type SplashScreenProps = {
  isFading?: boolean;
};

export function SplashScreen({ isFading = false }: SplashScreenProps) {
  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center px-4 transition-opacity duration-700 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <img
          src="/assets/logo.png"
          alt="L'Anøv Restaurant"
          className="w-[62vw] max-w-[760px] h-auto object-contain mx-auto"
        />
        <p
          className="mt-6 text-primary text-4xl sm:text-5xl tracking-[0.08em]"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          L&apos;ANØV
        </p>
        <p
          className="mt-2 text-primary/90 text-lg sm:text-2xl tracking-[0.24em]"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          RESTAURANT
        </p>
      </div>
    </div>
  );
}
