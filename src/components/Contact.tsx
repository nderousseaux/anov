'use client';

import { useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ContactContent {
  image?: string | null;
  title?: string | null;
  subtitle?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  hoursLine1?: string | null;
  hoursLine2?: string | null;
  mapsUrl?: string | null;
}

export function Contact({ content }: { content?: ContactContent | null }) {
  const c = content ?? {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Message envoyé!', {
      description: 'Nous vous répondrons dans les plus brefs délais.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="bg-background">
      {/* Hero avec image */}
      <div className="relative h-[15vh] sm:h-[50vh]">
        <img
          src={c.image ?? "https://images.unsplash.com/photo-1758612798971-a8adb6cba7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBhdG1vc3BoZXJlJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxNTE0NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080"}
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-card" />
        <div className="absolute top-18 sm:bottom-0 left-0 right-0 p-8 sm:p-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl mb-5 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {c.title ?? 'Contact'}
            </h2>
            <p
              className="text-sm sm:text-lg text-muted-foreground"
            >
              {c.subtitle ?? 'Nous sommes à votre écoute'}
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
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background/30 border-primary/30 text-muted-foreground text-sm sm:text-base"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/30 border-primary/30 text-muted-foreground text-sm sm:text-base"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground text-sm sm:text-base">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-background/30 border-primary/30 text-muted-foreground text-sm sm:text-base"
                    placeholder="Demande d'information"
                  />
                </div>

                <div className="space-y-2 flex flex-col flex-1">
                  <Label htmlFor="message" className="text-foreground text-sm sm:text-base">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full flex-1 bg-background/30 border border-primary/30 text-muted-foreground text-sm sm:text-base rounded-md p-3 min-h-[120px] sm:min-h-[150px] placeholder:text-muted-foreground focus:border-primary focus:bg-background/50 focus:outline-none transition-colors duration-300"
                    placeholder="Votre message..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 sm:py-6 transition-all duration-300"
                >
                  Envoyer le message
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
                    Téléphone
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
                    Email
                  </h3>
                </div>
                <p className="text-foreground text-sm sm:text-base">
                  <a href={`mailto:${c.email ?? 'contact@lanov.fr'}`} className="hover:text-primary transition-colors">
                    {c.email ?? 'contact@lanov.fr'}
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
                    Adresse
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
                    Horaires
                  </h3>
                </div>
                <div
                  className="text-foreground text-sm sm:text-base space-y-1"
                >
                  <p>{c.hoursLine1 ?? 'Mardi - Samedi : 12h00 - 14h30, 19h00 - 22h30'}</p>
                  <p>{c.hoursLine2 ?? 'Dimanche - Lundi : Fermé'}</p>
                </div>
              </div>

              {/* Map Link */}
              <Button
                onClick={() => window.open(c.mapsUrl ?? 'https://maps.google.com', '_blank')}
                className="col-span-2 w-full bg-secondary hover:bg-muted text-foreground border border-primary/30 py-4 sm:py-6 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                Voir sur Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
