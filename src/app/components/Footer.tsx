import React from 'react';
import { Facebook, Instagram, Youtube, Star } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' },
  ];

  const reviewPlatforms = [
    { name: 'TripAdvisor', rating: '5.0', reviews: '248' },
    { name: 'Google', rating: '4.9', reviews: '312' },
    { name: 'La Fourchette', rating: '9.8', reviews: '189' },
  ];

  return (
    <footer className="bg-background border-t border-primary/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <img
              src="/assets/logo.png"
              alt="Logo l’Anøv"
              className="h-20 w-auto mb-4"
            />
            <p
              className="text-muted-foreground mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Une expérience gastronomique d'exception où chaque plat raconte une histoire.
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h4
              className="text-xl text-primary mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Suivez-nous
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card p-3 rounded-lg border border-primary/30 hover:border-primary hover:bg-secondary transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="text-primary group-hover:text-primary/90" size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h4
              className="text-xl text-primary mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nos Avis
            </h4>
            <div className="space-y-3">
              {reviewPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className="bg-card p-3 rounded-lg border border-primary/30 hover:border-primary transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-foreground"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {platform.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Star className="text-primary fill-primary" size={16} />
                      <span
                        className="text-primary/90"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {platform.rating}
                      </span>
                      <span
                        className="text-muted-foreground text-sm"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        ({platform.reviews} avis)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p
                className="text-muted-foreground text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                © 2026 l’Anøv <span style={{ fontFamily: 'var(--font-logo)' }}>Ø</span> Tous droits réservés.
              </p>
            </div>
            <div className="md:text-right">
              <div className="flex flex-wrap gap-4 md:justify-end">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Mentions légales
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Politique de confidentialité
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  CGV
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
