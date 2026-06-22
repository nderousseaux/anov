'use client';

import { useState, useEffect, useCallback, type FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Users, Phone, User, MessageSquare, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

type SlotInfo = { time: string; available: number };

function ReservationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('cancelled') === '1') {
      toast.info('Paiement annulé, votre réservation n’a pas été confirmée.');
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
  });

  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); },
  );
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  const guestsNum = parseInt(formData.guests, 10);

  const selectedSlot = slots.find((s) => s.time === formData.time);
  const maxGuests = selectedSlot
    ? selectedSlot.available
    : slots.length > 0
      ? Math.max(...slots.map((s) => s.available))
      : 20;

  const loadSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingSlots(true);
    setFormData((prev) => ({ ...prev, time: '' }));
    try {
      const res = await fetch(`/api/reservations/availability?date=${date}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (formData.date) loadSlots(formData.date);
  }, [formData.date, loadSlots]);

  useEffect(() => {
    const y = calendarMonth.getFullYear();
    const m = String(calendarMonth.getMonth() + 1).padStart(2, '0');
    fetch(`/api/reservations/availability?month=${y}-${m}`)
      .then((r) => r.json())
      .then((data) => {
        setUnavailableDates(
          (data.unavailableDates ?? []).map((d: string) => new Date(d + 'T00:00:00')),
        );
      })
      .catch(() => { });
  }, [calendarMonth]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.date) {
      toast.error('Veuillez choisir une date');
      return;
    }
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
      // Redirection vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement manquante');
      }
    } catch {
      toast.error('Erreur réseau, veuillez réessayer');
    } finally {
      setSubmitting(false);
    }
  };

  const lunchSlots = slots.filter((s) => parseInt(s.time) < 15);
  const dinnerSlots = slots.filter((s) => parseInt(s.time) >= 15);

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
          <p className="text-xl text-muted-foreground">
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
                  Téléphone <span className="text-muted-foreground text-xs">(optionnel)</span>
                </Label>
                <Input
                  id="phone" type="tel"
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
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-foreground focus:bg-primary/20">
                      {n} personne{n > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary" />
                Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 h-10 px-3 rounded-md border border-primary/30 bg-background/30 text-sm text-left hover:border-primary/60 transition-colors"
                  >
                    <CalendarIcon size={14} className="text-primary shrink-0" />
                    {formData.date ? (
                      <span className="text-foreground">
                        {new Date(formData.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                          weekday: 'long', day: 'numeric', month: 'long',
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Choisir une date</span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-primary/30 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date + 'T00:00:00') : undefined}
                    onSelect={(date) => {
                      if (!date) return;
                      const y = date.getFullYear();
                      const mo = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      setFormData((prev) => ({ ...prev, date: `${y}-${mo}-${d}` }));
                      setCalendarOpen(false);
                    }}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    weekStartsOn={1}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;
                      return unavailableDates.some(
                        (u) =>
                          u.getFullYear() === date.getFullYear() &&
                          u.getMonth() === date.getMonth() &&
                          u.getDate() === date.getDate(),
                      );
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Créneaux */}
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
              ) : slots.length === 0 ? (
                <p className="text-sm text-destructive">Aucune disponibilité ce jour. Choisissez une autre date.</p>
              ) : (
                <div className="space-y-4">
                  {lunchSlots.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">☀️ Déjeuner</p>
                      <div className="flex flex-wrap gap-2">
                        {lunchSlots.map((slot) => {
                          const disabled = slot.available < guestsNum;
                          const selected = formData.time === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                if (disabled) return;
                                const newGuests = guestsNum > slot.available ? '' : formData.guests;
                                setFormData({ ...formData, time: slot.time, guests: newGuests });
                              }}
                              className={[
                                'flex flex-col items-center justify-center w-20 h-14 rounded border text-sm font-medium transition-all',
                                selected
                                  ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                  : disabled
                                    ? 'bg-background/10 border-primary/10 text-muted-foreground/40 cursor-not-allowed'
                                    : 'bg-background/30 border-primary/30 text-foreground hover:border-primary/70 hover:bg-primary/10',
                              ].join(' ')}
                            >
                              <span>{slot.time}</span>
                              <span className={['text-xs', selected ? 'text-primary-foreground/80' : disabled ? 'text-muted-foreground/40' : 'text-muted-foreground'].join(' ')}>
                                {slot.available} place{slot.available > 1 ? 's' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {dinnerSlots.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">🌙 Dîner</p>
                      <div className="flex flex-wrap gap-2">
                        {dinnerSlots.map((slot) => {
                          const disabled = slot.available < guestsNum;
                          const selected = formData.time === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                if (disabled) return;
                                const newGuests = guestsNum > slot.available ? '' : formData.guests;
                                setFormData({ ...formData, time: slot.time, guests: newGuests });
                              }}
                              className={[
                                'flex flex-col items-center justify-center w-20 h-14 rounded border text-sm font-medium transition-all',
                                selected
                                  ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                  : disabled
                                    ? 'bg-background/10 border-primary/10 text-muted-foreground/40 cursor-not-allowed'
                                    : 'bg-background/30 border-primary/30 text-foreground hover:border-primary/70 hover:bg-primary/10',
                              ].join(' ')}
                            >
                              <span>{slot.time}</span>
                              <span className={['text-xs', selected ? 'text-primary-foreground/80' : disabled ? 'text-muted-foreground/40' : 'text-muted-foreground'].join(' ')}>
                                {slot.available} place{slot.available > 1 ? 's' : ''}
                              </span>
                            </button>
                          );
                        })}
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

            {/* Bouton submit */}
            <Button
              type="submit"
              disabled={submitting || !formData.time}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  En cours...
                </span>
              ) : (
                'Confirmer la réservation'
              )}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4"><p className="text-foreground text-xl">Chargement...</p></div>}>
      <ReservationForm />
    </Suspense>
  );
}
