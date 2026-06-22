'use client';

import { Facebook, Instagram, Star, CreditCard, Accessibility, AirVent } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

// TikTok SVG icon component (not available in lucide-react)
function TiktokIcon({ className, size, ...props }: { className?: string; size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export interface FooterContent {
  description_fr?: string | null;
  description_en?: string | null;
  description_de?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  reviews?: Array<{ name: string; rating: string; reviewCount: string }> | null;
  paymentMethods?: string | null;
}

export function Footer({ content }: { content?: Record<string, unknown> | null }) {
  const { locale, t } = useLanguage();
  const c = (content ?? {}) as Record<string, unknown>;
  const logoUrl = 'assets/img-logo.svg';
  const description = pickField(c, 'description', locale) || "Une expérience gastronomique d'exception où chaque plat raconte une histoire.";

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: (c.facebookUrl as string) ?? '#' },
    { name: 'Instagram', icon: Instagram, url: (c.instagramUrl as string) ?? '#' },
    { name: 'TikTok', icon: TiktokIcon, url: (c.tiktokUrl as string) ?? '#' },
  ];

  const reviewPlatforms = (c.reviews as Array<{ name: string; rating: string; reviewCount: string }>) ?? [
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
                  {description}
                </p>
              </div>

              {/* Social Media */}
              <div className="text-center md:text-left">
                <h4
                  className="text-lg md:text-xl text-primary mb-3 md:mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t.footer.followUs}
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
              {t.footer.ourReviews}
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-3">
              {reviewPlatforms.map((platform: { name: string; rating: string; reviewCount: string }) => (
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
                        ({platform.reviewCount} {t.footer.reviews})
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
              <span>{(c.paymentMethods as string | undefined) ?? 'CB · Visa · Mastercard · Amex · Espèces · Chèques'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
              <Accessibility size={14} className="text-primary/70 shrink-0" />
              <span>{t.footer.pmr}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
              <AirVent size={14} className="text-primary/70 shrink-0" />
              <span>{t.footer.aircon}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-4 md:pt-6">
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 items-center gap-3">
            <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
              {t.footer.copyright}
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-end">
              <Link href="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm">
                {t.footer.legal}
              </Link>
              <Link href="/politique-de-confidentialite" className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm">
                {t.footer.privacy}
              </Link>
              <Link href="/cgv" className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm">
                {t.footer.cgv}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
