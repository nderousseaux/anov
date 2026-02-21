import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnHero, setIsOnHero] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}assets/img-logo.png`;
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isHomePage) {
      setIsOnHero(false);
      return;
    }

    const updateHeroState = () => {
      const heroSection =
        document.getElementById('hero') ??
        document.querySelector('main section');
      if (!heroSection) {
        setIsOnHero(false);
        return;
      }

      const heroHeight = heroSection.getBoundingClientRect().height;
      const transitionThreshold = heroHeight * 0.25;
      setIsOnHero(window.scrollY < transitionThreshold);
    };

    updateHeroState();
    const frameId = window.requestAnimationFrame(updateHeroState);
    window.addEventListener('scroll', updateHeroState, { passive: true });
    window.addEventListener('resize', updateHeroState);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateHeroState);
      window.removeEventListener('resize', updateHeroState);
    };
  }, [isHomePage]);

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

  const menuItemClass =
    'relative inline-flex items-center text-[0.95rem] tracking-[0.01em] text-foreground transition-all duration-300 ease-out hover:text-primary focus-visible:outline-none after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-primary/80 after:transition-transform after:duration-300 hover:after:scale-x-100';

  const activeMenuItemClass = 'text-primary after:scale-x-100';

  const reservationButtonClass =
    'rounded-full border-2 border-primary/80 bg-transparent text-primary px-6 py-2.5 tracking-[0.03em] shadow-sm transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md';

  const isTransparent = isHomePage && isOnHero && !mobileMenuOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-background/95 backdrop-blur-sm border-b border-primary/20'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`cursor-pointer flex items-center transition-opacity duration-300 ${isTransparent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            aria-hidden={isTransparent}
          >
            <img
              src={logoUrl}
              alt="Logo l’anøv"
              className="h-12 sm:h-14 w-auto -translate-y-2"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {/* Links to page sections */}
            <button
              onClick={() => scrollToSection('history')}
              className={menuItemClass}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Notre Histoire
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className={menuItemClass}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Galerie
            </button>
            <span
              className="text-primary/80 text-base"
              aria-hidden="true"
            >
              |
            </span>

            {/* Links to other pages */}
            <Link
              to="/menu"
              className={`${menuItemClass} ${isActive('/menu') ? activeMenuItemClass : ''}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              La Carte
            </Link>
            <Link
              to="/boutique"
              className={`${menuItemClass} ${isActive('/boutique') ? activeMenuItemClass : ''}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Boutique
            </Link>

            {/* CTA Button - Highlighted */}
            <Link to="/reservation">
              <Button
                className={reservationButtonClass}
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
                  className="w-full rounded-full border-2 border-primary/80 bg-transparent text-primary py-3 tracking-[0.03em] shadow-sm transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md"
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
