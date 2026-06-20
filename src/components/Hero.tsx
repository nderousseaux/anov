'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';
import type { HeroContent } from '@/types/content';

interface HeroProps {
  content?: Record<string, unknown> | null;
}

export function Hero({ content }: HeroProps) {
  const { locale, t } = useLanguage();
  const subtitle = content ? pickField(content, 'subtitle', locale) : t.hero.reserve;
  const heroImageUrl = content?.image ?? '/assets/hero.jpg';
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  useEffect(() => {
    const hideAfterScrollY = 64;

    const updateScrollState = () => {
      setIsArrowVisible(window.scrollY < hideAfterScrollY);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  const scrollToHistory = () => {
    const element = document.getElementById('history');
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl as string}
          alt="Ambiance restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <img
          src="/assets/text-logo.svg"
          alt="Logo"
          className="mx-auto mb-8 w-auto h-20 sm:h-24 md:h-36"
        />

        <p
          className="text-base sm:text-xl md:text-2xl mb-12 text-foreground max-w-2xl mx-auto italic leading-relaxed tracking-wide"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {subtitle || 'Où chaque plat raconte une histoire, où chaque saveur éveille les sens'}
        </p>
        {/* <Link href="/reservation">
          <Button
            className="rounded-full border-2 border-primary/90 bg-background/35 backdrop-blur-sm text-primary px-9 py-6 text-lg tracking-[0.03em] shadow-md transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg"
          >
            Réserver une table
          </Button>
        </Link> */}
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToHistory}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce cursor-pointer transition-opacity duration-500 ${isArrowVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <ChevronDown className="text-primary" size={32} />
      </button>
    </section>
  );
}
