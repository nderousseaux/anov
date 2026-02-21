import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message envoyé!', {
      description: 'Nous vous répondrons dans les plus brefs délais.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="bg-background">
      {/* Hero avec image */}
      <div className="relative h-[50vh]">
        <img
          src="https://images.unsplash.com/photo-1758612798971-a8adb6cba7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBhdG1vc3BoZXJlJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxNTE0NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2
              className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact
            </h2>
            <p
              className="text-xl sm:text-2xl text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Nous sommes à votre écoute
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg border border-primary/30 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                    placeholder="Demande d'information"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background/30 border border-primary/30 text-foreground rounded-md p-3 min-h-[150px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Votre message..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Address */}
              <div className="bg-secondary p-6 rounded-lg border border-primary/30">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3
                      className="text-xl text-primary mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Adresse
                    </h3>
                    <p
                      className="text-foreground"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      15 Rue de la Gastronomie<br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-secondary p-6 rounded-lg border border-primary/30">
                <div className="flex items-start gap-4">
                  <Phone className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3
                      className="text-xl text-primary mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Téléphone
                    </h3>
                    <p
                      className="text-foreground"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      +33 1 45 67 89 00
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-secondary p-6 rounded-lg border border-primary/30">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3
                      className="text-xl text-primary mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Email
                    </h3>
                    <p
                      className="text-foreground"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      contact@lanov.fr
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-secondary p-6 rounded-lg border border-primary/30">
                <div className="flex items-start gap-4">
                  <Clock className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3
                      className="text-xl text-primary mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Horaires
                    </h3>
                    <div
                      className="text-foreground space-y-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <p>Mardi - Samedi : 12h00 - 14h30, 19h00 - 22h30</p>
                      <p>Dimanche - Lundi : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Link */}
              <Button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="w-full bg-secondary hover:bg-muted text-foreground border border-primary/30 py-6 transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-body)' }}
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
