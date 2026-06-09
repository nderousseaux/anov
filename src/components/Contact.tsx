'use client';

import { useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

interface ContactContent {
  image?: string | null;
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  hoursLine1_fr?: string | null;
  hoursLine1_en?: string | null;
  hoursLine1_de?: string | null;
  hoursLine2_fr?: string | null;
  hoursLine2_en?: string | null;
  hoursLine2_de?: string | null;
  mapsUrl?: string | null;
}

export function Contact({ content }: { content?: ContactContent | null }) {
  const { locale, t } = useLanguage();
  const c = content ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (key: string) => pickField(c as any, key, locale);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t.contact.successTitle, {
          description: t.contact.successDesc,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(t.contact.errorTitle, {
          description: data.error || t.contact.errorDesc,
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error(t.contact.errorTitle, {
        description: t.contact.connectionError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-background">
      {/* Hero avec image */}
      <div className="relative h-[15vh] sm:h-[40vh]">
        <img
          src={c.image ?? "https://images.unsplash.com/photo-1758612798971-a8adb6cba7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBhdG1vc3BoZXJlJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxNTE0NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080"}
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-card" />
        <div className="absolute top-18 sm:top-50 left-0 right-0 p-8 sm:p-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl mb-5 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {p('title') || 'Contact'}
            </h2>
            <p
              className="text-sm sm:text-lg text-muted-foreground"
            >
              {p('subtitle') || 'Nous sommes à votre écoute'}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-26 pb-14 md:py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
            {/* Contact Form */}
            <div className="h-full">
              <form onSubmit={handleSubmit} className="bg-secondary p-5 sm:p-8 rounded-lg border border-primary/30 flex flex-col gap-4 sm:gap-6 h-full">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground text-sm sm:text-base">
                    {t.contact.name}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background/30 border-primary/30 text-sm sm:text-base"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-sm sm:text-base">
                    {t.contact.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/30 border-primary/30 text-sm sm:text-base"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground text-sm sm:text-base">
                    {t.contact.subject}
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-background/30 border-primary/30 text-sm sm:text-base"
                    placeholder={t.contact.subjectPlaceholder}
                  />
                </div>

                <div className="space-y-2 flex flex-col flex-1">
                  <Label htmlFor="message" className="text-foreground text-sm sm:text-base">
                    {t.contact.message}
                  </Label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full flex-1 bg-background/30 border border-primary/30 text-sm sm:text-base rounded-md p-3 min-h-[120px] sm:min-h-[150px] placeholder:text-muted-foreground focus:border-primary focus:bg-background/50 focus:outline-none transition-colors duration-300"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-color font-light text-md py-4 sm:py-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.contact.sending : t.contact.send}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between lg:gap-6 h-full">

              {/* Phone */}
              <div className="bg-secondary p-4 sm:p-6 rounded-lg border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="text-primary flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <h3
                    className="text-base sm:text-lg text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t.contact.phoneLabel}
                  </h3>
                </div>
                <p className="text-foreground text-sm sm:text-base">
                  <a href={`tel:${c.phone ?? '+33145678900'}`} className="hover:text-primary transition-colors">
                    {c.phone ?? '+33 1 45 67 89 00'}
                  </a>
                </p>
              </div>

              {/* Email */}
              <div className="bg-secondary p-4 sm:p-6 rounded-lg border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-primary flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <h3
                    className="text-base sm:text-lg text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t.contact.mailLabel}
                  </h3>
                </div>
                <p className="text-foreground text-sm sm:text-base">
                  <a href={`mailto:${c.email ?? 'contact@anovrestaurant.fr'}`} className="hover:text-primary transition-colors">
                    {c.email ?? 'contact@anovrestaurant.fr'}
                  </a>
                </p>
              </div>

              {/* Address */}
              <div className="col-span-2 bg-secondary p-4 sm:p-6 rounded-lg border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-primary flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <h3
                    className="text-base sm:text-lg text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t.contact.addressLabel}
                  </h3>
                </div>
                <p
                  className="text-foreground text-sm sm:text-base"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {c.address ?? '15 Rue de la Gastronomie\n75008 Paris, France'}
                </p>
              </div>

              {/* Hours */}
              <div className="col-span-2 bg-secondary p-4 sm:p-6 rounded-lg border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-primary flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <h3
                    className="text-base sm:text-lg text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t.contact.hoursLabel}
                  </h3>
                </div>
                <div
                  className="text-foreground text-sm sm:text-base space-y-1"
                >
                  <p>{p('hoursLine1') || 'Mardi - Samedi : 12h00 - 14h30, 19h00 - 22h30'}</p>
                  <p>{p('hoursLine2') || 'Dimanche - Lundi : Fermé'}</p>
                </div>
              </div>

              {/* Map Link */}
              <Button
                onClick={() => window.open(c.mapsUrl ?? 'https://maps.google.com', '_blank')}
                className="col-span-2 w-full bg-secondary hover:bg-muted text-foreground border border-primary/30 py-4 sm:py-6 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                {t.contact.maps}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
