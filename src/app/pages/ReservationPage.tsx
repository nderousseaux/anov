import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Clock, Users, Mail, Phone, User, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simuler l'envoi de la réservation
    toast.success('Réservation confirmée!', {
      description: `Nous vous attendons le ${formData.date} à ${formData.time} pour ${formData.guests} personne(s).`,
    });

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
      specialRequest: '',
    });
  };

  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', 'Plus de 8'];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1765099271664-614c541196ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwYW1iaWFuY2V8ZW58MXx8fHwxNzcxNDMyNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Réservation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-card" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Réservez votre table
          </h1>
          <p
            className="text-xl sm:text-2xl md:text-3xl text-foreground mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Une expérience gastronomique inoubliable vous attend
          </p>
          <p
            className="text-lg sm:text-xl text-muted-foreground"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Du mardi au samedi • Service midi et soir
          </p>
        </div>
      </div>

      {/* Reservation Form */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card p-8 md:p-12 rounded-lg border border-primary/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                  <User size={18} className="text-primary" />
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

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Mail size={18} className="text-primary" />
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

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
                  <Phone size={18} className="text-primary" />
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Number of Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-foreground flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Nombre de personnes
                </Label>
                <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value })}>
                  <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-primary/30">
                    {guestOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-foreground focus:bg-primary/20">
                        {option} {option !== 'Plus de 8' && 'personne(s)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-foreground flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  Heure
                </Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                  <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                    <SelectValue placeholder="Choisir l'heure" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-primary/30 max-h-60">
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time} className="text-foreground focus:bg-primary/20">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="specialRequest" className="text-foreground">
                Demandes spéciales (optionnel)
              </Label>
              <textarea
                id="specialRequest"
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                className="w-full bg-background/30 border border-primary/30 text-foreground rounded-md p-3 min-h-[100px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Allergies, occasions spéciales, préférences de table..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base mt-8 transition-all duration-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Confirmer la réservation
            </Button>

            <p
              className="text-center text-sm text-muted-foreground mt-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              En réservant, vous acceptez nos conditions générales. Vous recevrez un email de confirmation.
            </p>
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Une question ?
          </h2>
          <p
            className="text-base text-foreground mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Notre équipe est à votre disposition pour toute demande particulière
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="tel:+33145678900"
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Phone className="text-primary" size={24} />
              <span>+33 1 45 67 89 00</span>
            </a>
            <a
              href="mailto:contact@lanov.fr"
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Mail className="text-primary" size={24} />
              <span>contact@lanov.fr</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
