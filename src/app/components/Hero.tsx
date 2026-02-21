import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const heroImageUrl = `${import.meta.env.BASE_URL}assets/hero/6.jpg`;
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
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl}
          alt="Ambiance restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-5 text-primary tracking-[0.06em]"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          L'ANØV
        </h1>
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10">
          <span className="h-px w-10 sm:w-14 bg-primary/80" />
          <p
            className="text-xl sm:text-2xl md:text-3xl text-primary tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            RESTAURANT
          </p>
          <span className="h-px w-10 sm:w-14 bg-primary/80" />
        </div>
        <p
          className="text-base sm:text-lg md:text-xl mb-12 text-foreground/85 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Où chaque plat raconte une histoire, où chaque saveur éveille les sens
        </p>
        <Link to="/reservation">
          <Button
            className="rounded-full border-2 border-primary/90 bg-background/35 backdrop-blur-sm text-primary px-9 py-6 text-lg tracking-[0.03em] shadow-md transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Réserver une table
          </Button>
        </Link>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToHistory}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce cursor-pointer transition-opacity duration-500 ${
          isArrowVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronDown className="text-primary" size={32} />
      </button>
    </section>
  );
}
