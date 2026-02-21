import React from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToHistory = () => {
    const element = document.getElementById('history');
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1768697358705-c1b60333da35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50JTIwZGluaW5nfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Restaurant élégant"
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
          className="text-base sm:text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Où chaque plat raconte une histoire, où chaque saveur éveille les sens
        </p>
        <Link to="/reservation">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Réserver une table
          </Button>
        </Link>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToHistory}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce cursor-pointer"
      >
        <ChevronDown className="text-primary" size={32} />
      </button>
    </section>
  );
}
