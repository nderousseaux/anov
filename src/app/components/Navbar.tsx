import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu
    setMobileMenuOpen(false);

    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="cursor-pointer flex items-center"
          >
            <img
              src="/assets/logo.png"
              alt="Logo l’anøv"
              className="h-12 sm:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Links to page sections */}
            <button
              onClick={() => scrollToSection('history')}
              className="text-foreground hover:text-primary transition-colors duration-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Notre Histoire
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-foreground hover:text-primary transition-colors duration-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Galerie
            </button>
            <span
              className="text-primary/80 text-lg"
              style={{ fontFamily: 'var(--font-logo)' }}
            >
              Ø
            </span>

            {/* Links to other pages */}
            <Link
              to="/menu"
              className={`transition-colors duration-300 ${isActive('/menu')
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
                }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              La Carte
            </Link>
            <Link
              to="/boutique"
              className={`transition-colors duration-300 ${isActive('/boutique')
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
                }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Boutique
            </Link>

            {/* CTA Button - Highlighted */}
            <Link to="/reservation">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Réserver
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('history')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left py-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Notre Histoire
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left py-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Galerie
              </button>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className={`transition-colors duration-300 text-left py-2 ${isActive('/menu')
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                  }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                La Carte
              </Link>
              <Link
                to="/boutique"
                onClick={() => setMobileMenuOpen(false)}
                className={`transition-colors duration-300 text-left py-2 ${isActive('/boutique')
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                  }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Boutique
              </Link>
              <Link
                to="/reservation"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
