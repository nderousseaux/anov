import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, Users, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export function Reservation() {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2
          className="text-4xl sm:text-5xl mb-4 text-primary"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Réservez votre table
        </h2>
        <p
          className="text-lg text-muted-foreground"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Une expérience gastronomique inoubliable vous attend
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg border border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nom */}
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

          {/* Téléphone */}
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

          {/* Nombre de personnes */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="text-foreground flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Nombre de personnes
            </Label>
            <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value })}>
              <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-primary/30">
                {[1, 2, 3, 4, 5, 6, 7, 8, '8+'].map((num) => (
                  <SelectItem key={num} value={String(num)} className="text-foreground focus:bg-primary/20">
                    {num} {typeof num === 'number' && num === 1 ? 'personne' : 'personnes'}
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

          {/* Heure */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Heure
            </Label>
            <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
              <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-primary/30">
                {['12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((time) => (
                  <SelectItem key={time} value={time} className="text-foreground focus:bg-primary/20">
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Demandes spéciales */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="special" className="text-foreground">
            Demandes spéciales (allergies, préférences...)
          </Label>
          <textarea
            id="special"
            value={formData.specialRequest}
            onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
            className="w-full bg-background/30 border border-primary/30 text-foreground rounded-md p-3 min-h-[100px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Partagez vos préférences ou besoins particuliers..."
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg transition-all duration-300"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Confirmer la réservation
        </Button>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Une confirmation vous sera envoyée par email et SMS
        </p>
      </form>
    </div>
  );
}
