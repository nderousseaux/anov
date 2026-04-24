import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Clock, Users, Mail, Phone, User, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

const DEPOSIT_THRESHOLD = 8;
const DEPOSIT_PER_PERSON = 20;

export function ReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
    wantsSmsReminder: false,
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('cancelled') === '1') {
      toast.error('Paiement annulé', {
        description: "Votre réservation n'a pas été confirmée. Vous pouvez réessayer.",
      });
    }
  }, [searchParams]);

  const loadSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingSlots(true);
    setFormData((prev) => ({ ...prev, time: '' }));
    try {
      const res = await fetch(`/api/reservations/availability?date=${date}`);
      const data = await res.json();
      setAvailableSlots(data.slots ?? []);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (formData.date) loadSlots(formData.date);
  }, [formData.date, loadSlots]);

  const guestsNum = parseInt(formData.guests, 10);
  const needsDeposit = !isNaN(guestsNum) && guestsNum >= DEPOSIT_THRESHOLD;
  const depositAmount = needsDeposit ? guestsNum * DEPOSIT_PER_PERSON : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      toast.error('Veuillez choisir un horaire');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Erreur lors de la réservation');
        return;
      }
      if (data.status === 'payment_required' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.status === 'confirmed') {
        router.push(`/reservation/succes?id=${data.reservationId}`);
      }
    } catch {
      toast.error('Erreur réseau, veuillez réessayer');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1765099271664-614c541196ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwYW1iaWFuY2V8ZW58MXx8fHwxNzcxNDMyNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Réservation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Réservez votre table
          </h1>
          <p className="text-xl text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            Du mardi au samedi · Service midi et soir
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card p-8 md:p-12 rounded-lg border border-primary/20 space-y-6">
            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                <User size={16} className="text-primary" />
                Nom complet
              </Label>
              <Input
                id="name" type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/30 border-primary/30 text-foreground"
                placeholder="Jean Dupont"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Email
                </Label>
                <Input
                  id="email" type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/30 border-primary/30 text-foreground"
                  placeholder="jean@example.com"
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  Téléphone
                </Label>
                <Input
                  id="phone" type="tel" required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background/30 border-primary/30 text-foreground"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {/* Nombre de personnes */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Nombre de personnes
              </Label>
              <Select
                value={formData.guests}
                onValueChange={(v) => setFormData({ ...formData, guests: v, time: '' })}
              >
                <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-primary/30">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-foreground focus:bg-primary/20">
                      {n} personne{n > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {needsDeposit && (
                <p className="text-sm text-primary mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Un acompte de <strong>{depositAmount} €</strong> sera demandé pour les groupes de {DEPOSIT_THRESHOLD}+ personnes.
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Date
              </Label>
              <Input
                id="date" type="date" required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-background/30 border-primary/30 text-foreground"
                min={todayStr}
              />
            </div>

            {/* Créneaux horaires */}
            <div className="space-y-3">
              <Label className="text-foreground flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Heure
                {loadingSlots && <Loader2 size={14} className="animate-spin text-primary ml-1" />}
              </Label>

              {!formData.date ? (
                <p className="text-sm text-muted-foreground">Choisissez d&apos;abord une date.</p>
              ) : loadingSlots ? (
                <p className="text-sm text-muted-foreground">Chargement des disponibilités…</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-destructive">Aucune disponibilité ce jour. Choisissez une autre date.</p>
              ) : (
                <div className="space-y-4">
                  {/* Déjeuner */}
                  {availableSlots.some((s) => parseInt(s) < 15) && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">☀️ Déjeuner</p>
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.filter((s) => parseInt(s) < 15).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({ ...formData, time: slot })}
                            className={`w-16 h-10 rounded border text-sm font-medium transition-all ${
                              formData.time === slot
                                ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                : 'bg-background/30 border-primary/30 text-foreground hover:border-primary/70 hover:bg-primary/10'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dîner */}
                  {availableSlots.some((s) => parseInt(s) >= 15) && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">🌙 Dîner</p>
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.filter((s) => parseInt(s) >= 15).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({ ...formData, time: slot })}
                            className={`w-16 h-10 rounded border text-sm font-medium transition-all ${
                              formData.time === slot
                                ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                : 'bg-background/30 border-primary/30 text-foreground hover:border-primary/70 hover:bg-primary/10'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Demandes spéciales */}
            <div className="space-y-2">
              <Label htmlFor="specialRequest" className="text-foreground flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                Demandes spéciales{' '}
                <span className="text-muted-foreground text-xs">(optionnel)</span>
              </Label>
              <textarea
                id="specialRequest"
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                className="w-full bg-background/30 border border-primary/30 text-foreground rounded-md p-3 min-h-[80px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Allergies, occasion spéciale, préférences de table..."
              />
            </div>

            {/* SMS Reminder */}
            <div className="flex items-start gap-3 p-4 bg-background/30 border border-primary/20 rounded-md">
              <input
                id="sms"
                type="checkbox"
                checked={formData.wantsSmsReminder}
                onChange={(e) => setFormData({ ...formData, wantsSmsReminder: e.target.checked })}
                className="mt-1 accent-primary"
              />
              <div>
                <Label htmlFor="sms" className="text-foreground cursor-pointer font-medium">
                  Recevoir un rappel par SMS
                </Label>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Un SMS vous sera envoyé 48h avant votre réservation au numéro renseigné ci-dessus.
                </p>
              </div>
            </div>

            {/* Bouton submit */}
            <Button
              type="submit"
              disabled={submitting || !formData.time}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  En cours...
                </span>
              ) : needsDeposit ? (
                `Réserver et payer l'acompte (${depositAmount} €)`
              ) : (
                'Confirmer la réservation'
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              En réservant, vous acceptez nos{' '}
              <a href="/cgv" className="underline hover:text-primary">conditions générales</a>.
              {' '}Un email de confirmation vous sera envoyé.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
