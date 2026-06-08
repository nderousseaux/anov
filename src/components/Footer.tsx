import { Facebook, Instagram, Youtube, Star, CreditCard, Accessibility, AirVent } from 'lucide-react';
import Link from 'next/link';

export interface FooterContent {
  description?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  reviews?: Array<{ name: string; rating: string; reviewCount: string }> | null;
  paymentMethods?: string | null;
}

export function Footer({ content }: { content?: FooterContent | null }) {
  const c = content ?? {};
  const logoUrl = 'assets/img-logo.svg';

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: c.facebookUrl ?? '#' },
    { name: 'Instagram', icon: Instagram, url: c.instagramUrl ?? '#' },
    { name: 'YouTube', icon: Youtube, url: c.youtubeUrl ?? '#' },
  ];

  const reviewPlatforms = c.reviews ?? [
    { name: 'TripAdvisor', rating: '5.0', reviewCount: '248' },
    { name: 'Google', rating: '4.9', reviewCount: '312' },
    { name: 'La Fourchette', rating: '9.8', reviewCount: '189' },
  ];

  return (
    <footer className="bg-background border-t border-primary/20 py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-6 md:mb-8">
          <div className="md:col-span-2 flex flex-col gap-6 md:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              {/* Logo & Description */}
              <div className="text-center md:text-left">
                <img
                  src={logoUrl}
                  alt="Logo l’Anøv"
                  className="h-14 md:h-16 w-auto mx-auto md:mx-0"
                />
                <p
                  className="text-muted-foreground text-sm md:text-base mt-4 md:my-6"
                >
                  {c.description ?? "Une expérience gastronomique d'exception où chaque plat raconte une histoire."}
                </p>
              </div>

              {/* Social Media */}
              <div className="text-center md:text-left">
                <h4
                  className="text-lg md:text-xl text-primary mb-3 md:mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Suivez-nous
                </h4>
                <div className="flex gap-4 justify-center md:justify-start">
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
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h4
              className="text-lg md:text-xl text-primary mb-3 md:mb-4 text-center md:text-left"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nos Avis
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-3">
              {reviewPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className="bg-card p-2 md:p-3 rounded-lg border border-primary/30 hover:border-primary transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <span className="text-foreground text-xs md:text-base font-medium truncate">
                      {platform.name}
                    </span>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Star className="text-primary fill-primary shrink-0" size={12} />
                      <span className="text-primary/90 text-xs md:text-base">
                        {platform.rating}
                      </span>
                      <span className="text-muted-foreground text-xs hidden md:inline">
                        ({platform.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commodités */}
          <div className="md:col-span-3 flex flex-wrap items-center gap-3 md:gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
              <CreditCard size={14} className="text-primary/70 shrink-0" />
              <span>{c.paymentMethods ?? 'CB · Visa · Mastercard · Amex · Espèces · Chèques'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
              <Accessibility size={14} className="text-primary/70 shrink-0" />
              <span>Accès PMR</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
              <AirVent size={14} className="text-primary/70 shrink-0" />
              <span>Climatisé</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-4 md:pt-6">
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 items-center gap-3">
            <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
              © 2026 l’Anøv | Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-end">
              <Link href="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm">
                Mentions légales
              </Link>
              <Link href="/politique-de-confidentialite" className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm">
                Politique de confidentialité
              </Link>
              <Link href="/cgv" className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
