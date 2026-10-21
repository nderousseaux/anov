"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Phone,
  User,
  MessageSquare,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { Locale } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { pickField } from "@/lib/langs";
import { MAX_GROUP_SIZE, type ServiceKey } from "@/lib/seating";

type ServiceInfo = {
  key: ServiceKey;
  slots: string[];
  started: boolean;
  available: boolean;
};
const MAX_GUESTS = MAX_GROUP_SIZE;
/** Valeur du sélecteur pour « plus de MAX_GUESTS personnes » : réservation par téléphone. */
const LARGE_GROUP = "more";

interface ReservationFormProps {
  content?: Record<string, unknown> | null;
  /** Numéro affiché pour les grands groupes (variable d'environnement RESTAURANT_PHONE). */
  restaurantPhone?: string;
}

export function ReservationForm({
  content,
  restaurantPhone,
}: ReservationFormProps) {
  const { locale, t } = useLanguage();
  const c = (content ?? {}) as Record<string, unknown>;

  // Translation constants are accessed directly via t.reservation.*
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    specialRequest: "",
  });

  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  // Events
  const [events, setEvents] = useState<
    { title: string; description: string }[]
  >([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const isLargeGroup = formData.guests === LARGE_GROUP;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les données du formulaire depuis sessionStorage si disponibles
  // (quand l'utilisateur revient de Stripe après paiement)
  // Use pageshow event to handle back/forward cache (bfcache)
  useEffect(() => {
    const loadFromSessionStorage = () => {
      if (typeof window !== "undefined") {
        const storedData = sessionStorage.getItem("reservationFormData");
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
            // Keep data in sessionStorage for potential modifications
          } catch {
            // Invalid JSON, ignore
          }
        }
      }
    };

    // Load immediately on mount
    // Use a small timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (typeof window !== "undefined") {
        const storedData = sessionStorage.getItem("reservationFormData");
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
          } catch {
            // Invalid JSON, ignore
          }
        }
      }
    }, 100);

    // Also listen for pageshow event (fired when page is restored from bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        loadFromSessionStorage();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const loadServices = useCallback(async (date: string, guests: string) => {
    if (!date || !guests || guests === LARGE_GROUP) return;
    setLoadingServices(true);
    setService(null);
    setFormData((prev) => ({ ...prev, time: "" }));
    try {
      const res = await fetch(
        `/api/reservations/availability?date=${date}&guests=${guests}`,
      );
      const data = await res.json();
      setServices(data.services ?? []);
    } catch {
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    if (formData.date && formData.guests && !isLargeGroup)
      loadServices(formData.date, formData.guests);
  }, [formData.date, formData.guests, isLargeGroup, loadServices]);

  // Load events when date changes
  useEffect(() => {
    if (!formData.date) {
      setEvents([]);
      return;
    }
    setLoadingEvents(true);
    fetch(`/api/events?date=${formData.date}&locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? []);
      })
      .catch(() => {
        setEvents([]);
      })
      .finally(() => {
        setLoadingEvents(false);
      });
  }, [formData.date, locale]);

  useEffect(() => {
    if (!formData.guests || isLargeGroup) return;
    const y = calendarMonth.getFullYear();
    const m = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    fetch(
      `/api/reservations/availability?month=${y}-${m}&guests=${formData.guests}`,
    )
      .then((r) => r.json())
      .then((data) => {
        setUnavailableDates(
          (data.unavailableDates ?? []).map(
            (d: string) => new Date(d + "T00:00:00"),
          ),
        );
      })
      .catch(() => {});
  }, [calendarMonth, formData.guests, isLargeGroup]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLargeGroup) return;
    if (!formData.phone) {
      toast.error(t.reservation.errorPhone);
      return;
    }
    if (!formData.date) {
      toast.error(t.reservation.errorSelectDate);
      return;
    }
    if (!formData.time) {
      toast.error(t.reservation.errorSelectTime);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t.reservation.errorReservation);
        return;
      }
      // Stocker les données du formulaire dans sessionStorage pour persistance
      // après le paiement Stripe
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reservationFormData", JSON.stringify(formData));
      }
      // Redirection vers Stripe Checkout
      if (data.url) {
        setRedirecting(true);
        // Petit délai pour afficher le message avant la redirection
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else {
        throw new Error("URL de paiement manquante");
      }
    } catch {
      toast.error(t.reservation.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  // Un service déjà entamé aujourd'hui n'est plus proposé ; un service complet est grisé.
  const openServices = services.filter((s) => !s.started);
  const selectedService = openServices.find(
    (s) => s.key === service && s.available,
  );

  const heroImageUrl = (c.image as string | undefined) ?? "/assets/hero.jpg";
  const title = pickField(c, "title", locale);
  const subtitle = pickField(c, "subtitle", locale);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt="Réservation"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Formulaire */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card p-8 md:p-12 rounded-lg border border-primary/20 space-y-6"
          >
            {/* Nom */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-foreground flex items-center gap-2"
              >
                <User size={16} className="text-primary" />
                {t.reservation.name}
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-background/30 border-primary/30 text-foreground"
                placeholder={t.reservation.placeholderName}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground flex items-center gap-2"
                >
                  {t.reservation.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-background/30 border-primary/30 text-foreground"
                  placeholder={t.reservation.placeholderEmail}
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-foreground flex items-center gap-2"
                >
                  <Phone size={16} className="text-primary" />
                  {t.reservation.phone}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-background/30 border-primary/30 text-foreground"
                  placeholder={t.reservation.placeholderPhone}
                />
              </div>
            </div>

            {/* Nombre de personnes */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Users size={16} className="text-primary" />
                {t.reservation.guests}
              </Label>
              <Select
                value={formData.guests}
                onValueChange={(v) =>
                  setFormData({ ...formData, guests: v, time: "" })
                }
              >
                <SelectTrigger className="bg-background/30 border-primary/30 text-foreground hover:border-primary/60">
                  <SelectValue placeholder={t.reservation.guests} />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-primary/30">
                  {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map(
                    (n) => (
                      <SelectItem
                        key={n}
                        value={String(n)}
                        className="text-foreground focus:bg-primary/20 data-[highlighted]:text-primary"
                      >
                        {n} personne{n > 1 ? "s" : ""}
                      </SelectItem>
                    ),
                  )}
                  <SelectItem
                    value={LARGE_GROUP}
                    className="text-foreground focus:bg-primary/20 data-[highlighted]:text-primary"
                  >
                    {t.reservation.moreThanMax}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLargeGroup ? (
              <div
                role="note"
                className="rounded-lg border border-primary/30 bg-primary/10 p-4 space-y-1 text-sm text-foreground"
              >
                <p>{t.reservation.largeGroup}</p>
                {restaurantPhone && (
                  <a
                    href={`tel:${restaurantPhone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-primary"
                  >
                    <Phone size={16} />
                    {restaurantPhone}
                  </a>
                )}
              </div>
            ) : (
              <>
                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <CalendarIcon size={16} className="text-primary" />
                    {t.reservation.date}
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 h-10 px-3 rounded-md border border-primary/30 bg-background/30 text-sm text-left hover:border-primary/60 transition-colors"
                      >
                        <CalendarIcon
                          size={14}
                          className="text-primary shrink-0"
                        />
                        {formData.date ? (
                          <span className="text-foreground">
                            {new Date(
                              formData.date + "T00:00:00",
                            ).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {t.reservation.selectDate}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-primary/30 bg-card"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          formData.date
                            ? new Date(formData.date + "T00:00:00")
                            : undefined
                        }
                        onSelect={(date: Date | null | undefined) => {
                          if (!date) return;
                          const y = date.getFullYear();
                          const mo = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const d = String(date.getDate()).padStart(2, "0");
                          setFormData((prev) => ({
                            ...prev,
                            date: `${y}-${mo}-${d}`,
                          }));
                          setCalendarOpen(false);
                        }}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        weekStartsOn={1}
                        locale={locale as string & Locale}
                        disabled={(date: Date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (date < today) return true;
                          // Aucun service disponible (fermé, complet, ou déjà entamé aujourd'hui)
                          if (
                            unavailableDates.some(
                              (u) =>
                                u.getFullYear() === date.getFullYear() &&
                                u.getMonth() === date.getMonth() &&
                                u.getDate() === date.getDate(),
                            )
                          ) {
                            return true;
                          }
                          return false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Events banner - displays when selected date has events */}
                {(events.length > 0 || loadingEvents) && (
                  <div className="space-y-2">
                    {loadingEvents ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2
                          size={14}
                          className="animate-spin text-primary"
                        />
                        Chargement des événements...
                      </div>
                    ) : (
                      events.length > 0 && (
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2 text-purple-400">
                            <CalendarDays size={16} />
                            <span className="font-semibold text-purple-300">
                              {locale === "fr"
                                ? "Événement spécial"
                                : locale === "en"
                                  ? "Special Event"
                                  : "Spezial-Event"}
                            </span>
                          </div>
                          {events.map((event, idx) => (
                            <div
                              key={idx}
                              className="bg-purple-500/5 border border-purple-500/20 rounded-md p-3 space-y-1"
                            >
                              <h4 className="font-medium text-purple-200 text-sm">
                                {event.title}
                              </h4>
                              <p className="text-purple-300/90 text-sm">
                                {event.description}
                              </p>
                            </div>
                          ))}
                          <p className="text-xs text-purple-400/70 italic">
                            {locale === "fr"
                              ? "Le menu et la décoration pourront être modifiés pour l'occasion."
                              : locale === "en"
                                ? "Menu and decor may be changed for the occasion."
                                : "Menü und Dekoration können für den Anlass angepasst werden."}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Service */}
                <div className="space-y-3">
                  <Label className="text-foreground flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    {t.reservation.service}
                    {loadingServices && (
                      <Loader2
                        size={14}
                        className="animate-spin text-primary ml-1"
                      />
                    )}
                  </Label>

                  {!formData.date ? (
                    <p className="text-sm text-muted-foreground">
                      {t.reservation.pleaseSelectDate}
                    </p>
                  ) : loadingServices ? (
                    <p className="text-sm text-muted-foreground">
                      {t.reservation.loading}
                    </p>
                  ) : openServices.length === 0 ? (
                    <p className="text-sm text-destructive">
                      {t.reservation.noServices}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {openServices.map((s) => {
                        const disabled = !s.available;
                        const selected = service === s.key;
                        return (
                          <button
                            key={s.key}
                            type="button"
                            disabled={disabled}
                            aria-pressed={selected}
                            onClick={() => {
                              setService(s.key);
                              setFormData((prev) => ({
                                ...prev,
                                time: s.slots.length === 1 ? s.slots[0] : "",
                              }));
                            }}
                            className={[
                              "flex flex-col items-center justify-center h-14 rounded border text-sm font-medium transition-all",
                              selected
                                ? "bg-primary border-primary text-primary-foreground shadow-md"
                                : disabled
                                  ? "bg-background/10 border-primary/10 text-muted-foreground/40 cursor-not-allowed"
                                  : "bg-background/30 border-primary/30 text-foreground hover:border-primary/70 hover:bg-primary/10",
                            ].join(" ")}
                          >
                            <span>
                              {s.key === "lunch"
                                ? t.reservation.lunch
                                : t.reservation.dinner}
                            </span>
                            {disabled && (
                              <span className="text-xs">
                                {t.reservation.full}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Heure d'arrivée, dans le service choisi (information : elle ne change pas la disponibilité) */}
                {selectedService && (
                  <div className="space-y-3">
                    <Label className="text-foreground">
                      {t.reservation.arrivalTime}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.slots.map((time) => {
                        const selected = formData.time === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setFormData({ ...formData, time })}
                            className={[
                              "flex items-center justify-center w-16 h-12 rounded border text-sm font-medium transition-all",
                              selected
                                ? "bg-primary border-primary text-primary-foreground shadow-md"
                                : "bg-background/30 border-primary/30 text-foreground hover:border-primary/70 hover:bg-primary/10",
                            ].join(" ")}
                          >
                            <span>{time}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Demandes spéciales */}
                <div className="space-y-2">
                  <Label
                    htmlFor="specialRequest"
                    className="text-foreground flex items-center gap-2"
                  >
                    <MessageSquare size={16} className="text-primary" />
                    {t.reservation.specialRequest}{" "}
                    <span className="text-muted-foreground text-xs">
                      (optionnel)
                    </span>
                  </Label>
                  <textarea
                    id="specialRequest"
                    value={formData.specialRequest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequest: e.target.value,
                      })
                    }
                    className="w-full bg-background/30 border border-primary/30 text-foreground text-sm rounded-md p-3 min-h-[80px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={t.reservation.specialRequestPlaceholder}
                  />
                </div>

                {/* Bouton submit */}
                <Button
                  type="submit"
                  disabled={submitting || !formData.time || !formData.phone}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base transition-all duration-300 disabled:opacity-50"
                >
                  {redirecting ? (
                    <span className="text-sm">
                      {t.reservation.redirectingPayment}
                    </span>
                  ) : submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      {t.reservation.submitSubmitting}
                    </span>
                  ) : (
                    t.reservation.submit
                  )}
                </Button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
