'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2, RefreshCw, ChevronLeft, ChevronRight,
  Settings, Save, X, CheckSquare, CalendarDays,
  RotateCcw, AlertTriangle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type ReservationStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface ReservationRow {
  id: string; name: string; email: string; phone: string;
  date: string; guests: number; status: ReservationStatus;
  specialRequest: string | null; wantsSmsReminder: boolean;
}

interface ApiResponse {
  data: ReservationRow[]; total: number; page: number; pageSize: number;
}

interface RestaurantSettings {
  maxCovers: number; mealDuration: number; openingDays: number[]; openingSlots: string[]; depositPerGuestCents: number;
}

interface DayInfo {
  date: string; dayOfWeek: number;
  isGloballyOpen: boolean; hasOverride: boolean;
  override: { closed: boolean; maxCovers: number | null; openingSlots: string[] | null } | null;
  effectiveOpen: boolean; effectiveMaxCovers: number; effectiveSlots: string[];
  mealDuration: number;
  lunchOpen: string | null; lunchClose: string | null;
  dinnerOpen: string | null; dinnerClose: string | null;
  totalCapacity: number; reservedGuests: number; reservationCount: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: 'En attente',
  CONFIRMED: 'Confirmé',
  CANCELLED: 'Annulé', COMPLETED: 'Terminé',
};

const STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  CONFIRMED: 'bg-green-600/20 text-green-400 border-green-600/30',
  CANCELLED: 'bg-red-600/20 text-red-400 border-red-600/30',
  COMPLETED: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
};

const ALL_SLOTS: Record<string, string[]> = {
  Déjeuner: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
  Dîner: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'],
};

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAYS_SHORT: Record<number, string> = { 0: 'Dim', 1: 'Lun', 2: 'Mar', 3: 'Mer', 4: 'Jeu', 5: 'Ven', 6: 'Sam' };
const DAYS_FULL: Record<number, string> = { 0: 'Dimanche', 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi' };
const MONTHS_ABBR = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const MONTHS_FULL = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPreviousMonday(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dow = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (dow === 0 ? 6 : dow - 1));
  return d.toISOString().split('T')[0];
}


function formatCardDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  return `${d.getUTCDate()} ${MONTHS_ABBR[d.getUTCMonth()]}`;
}

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  return `${DAYS_FULL[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminReservationsPage() {
  const router = useRouter();

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [editMaxCovers, setEditMaxCovers] = useState(20);
  const [editDepositPerGuest, setEditDepositPerGuest] = useState('20'); // en euros pour l'UI, stocké en string pour permettre la saisie libre
  const [editMealDuration, setEditMealDuration] = useState(90);
  const [editSlots, setEditSlots] = useState<string[]>([]);
  const [editDays, setEditDays] = useState<number[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Calendar
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const calendarStart = useMemo(() => {
    const first = new Date(Date.UTC(currentMonth.year, currentMonth.month, 1));
    const dow = first.getUTCDay();
    first.setUTCDate(first.getUTCDate() - (dow === 0 ? 6 : dow - 1));
    return first.toISOString().split('T')[0];
  }, [currentMonth]);
  const calendarDaysCount = useMemo(() => {
    const last = new Date(Date.UTC(currentMonth.year, currentMonth.month + 1, 0));
    const dow = last.getUTCDay();
    last.setUTCDate(last.getUTCDate() + (dow === 0 ? 0 : 7 - dow));
    const start = new Date(calendarStart + 'T00:00:00.000Z');
    return Math.round((last.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [currentMonth, calendarStart]);
  const [calendarDays, setCalendarDays] = useState<DayInfo[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  // Day detail
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayReservations, setDayReservations] = useState<ReservationRow[]>([]);
  const [dayLoading, setDayLoading] = useState(false);
  const [overrideMode, setOverrideMode] = useState<'global' | 'closed' | 'custom'>('global');
  const [overrideMaxCovers, setOverrideMaxCovers] = useState(20);
  const [overrideSlots, setOverrideSlots] = useState<string[]>([]);
  const [savingOverride, setSavingOverride] = useState(false);
  const [overrideSaved, setOverrideSaved] = useState(false);

  // ── Fetchers ─────────────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const s: RestaurantSettings = await res.json();
      setSettings(s);
      setEditMaxCovers(s.maxCovers);
      setEditDepositPerGuest(String(Math.round((s.depositPerGuestCents ?? 2000) / 100)));
      setEditMealDuration(s.mealDuration);
      setEditSlots(s.openingSlots);
      setEditDays(s.openingDays);
    }
  }, []);

  const fetchCalendar = useCallback(async () => {
    setCalendarLoading(true);
    const res = await fetch(`/api/admin/calendar?from=${calendarStart}&days=${calendarDaysCount}`);
    if (res.status === 401) { router.push('/admin/login'); return; }
    if (res.ok) setCalendarDays(await res.json());
    setCalendarLoading(false);
  }, [calendarStart, calendarDaysCount, router]);

  const fetchDayReservations = useCallback(async (date: string) => {
    setDayLoading(true);
    const res = await fetch(`/api/admin/reservations?date=${date}&page=1`);
    if (res.ok) setDayReservations((await res.json() as ApiResponse).data);
    setDayLoading(false);
  }, []);

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchSettings(); }, [fetchSettings]);
  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  // Fetch day reservations when selected date changes
  useEffect(() => {
    if (!selectedDate) return;
    fetchDayReservations(selectedDate);
  }, [selectedDate, fetchDayReservations]);

  // Sync override state when selected date or calendar data changes
  useEffect(() => {
    if (!selectedDate) return;
    const day = calendarDays.find((d) => d.date === selectedDate);
    if (!day) return;
    if (!day.hasOverride) {
      setOverrideMode('global');
    } else if (day.override?.closed) {
      setOverrideMode('closed');
    } else {
      setOverrideMode('custom');
      setOverrideMaxCovers(day.override?.maxCovers ?? day.effectiveMaxCovers);
      setOverrideSlots(day.override?.openingSlots ?? day.effectiveSlots);
    }
  }, [selectedDate, calendarDays]);

  // ── Actions ───────────────────────────────────────────────────────────────────
  const saveSettings = async () => {
    setSavingSettings(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxCovers: editMaxCovers, mealDuration: editMealDuration, openingDays: editDays, openingSlots: editSlots, depositPerGuestCents: Math.max(0, parseInt(editDepositPerGuest, 10) || 0) * 100 }),
    });
    if (res.status === 409) {
      const data = await res.json();
      alert(`Impossible d'enregistrer ces paramètres : des réservations actives seraient impactées.\n\n${data.message}\n\nAnnulez-les d'abord.`);
      setSavingSettings(false);
      return;
    }
    if (res.ok) {
      setSettings(await res.json());
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
      fetchCalendar();
    }
    setSavingSettings(false);
  };

  const saveOverride = async () => {
    if (!selectedDate) return;

    const activeReservations = dayReservations.filter(
      (r) => r.status === 'CONFIRMED'
    );

    if (overrideMode === 'closed' && activeReservations.length > 0) {
      alert(
        `Impossible de fermer ce jour : ${activeReservations.length} réservation(s) active(s) en cours.\nAnnulez-les d'abord.`
      );
      return;
    }

    if (overrideMode === 'custom' && activeReservations.length > 0) {
      const impacted = activeReservations.filter((r) => {
        const d = new Date(r.date);
        const slotTime = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
        return !overrideSlots.includes(slotTime);
      });
      if (impacted.length > 0) {
        alert(
          `Impossible de retirer ces créneaux : ${impacted.length} réservation(s) active(s) seraient impactées.\nAnnulez-les d'abord.`
        );
        return;
      }
    }

    setSavingOverride(true);
    if (overrideMode === 'global') {
      await fetch(`/api/admin/overrides/${selectedDate}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/admin/overrides/${selectedDate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closed: overrideMode === 'closed',
          maxCovers: overrideMode === 'custom' ? overrideMaxCovers : null,
          openingSlots: overrideMode === 'custom' ? overrideSlots : null,
        }),
      });
    }
    setOverrideSaved(true);
    setTimeout(() => setOverrideSaved(false), 2000);
    setSavingOverride(false);
    fetchCalendar();
  };

  const updateStatus = async (id: string, status: ReservationStatus, refreshDay?: string) => {
    await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (refreshDay) { fetchDayReservations(refreshDay); fetchCalendar(); }
  };

  const toggleSlot = (slot: string) =>
    setEditSlots((p) => p.includes(slot) ? p.filter((s) => s !== slot) : [...p, slot].sort());

  const toggleService = (svc: string[]) => {
    const all = svc.every((s) => editSlots.includes(s));
    setEditSlots((p) => all ? p.filter((s) => !svc.includes(s)) : [...new Set([...p, ...svc])].sort());
  };

  const toggleOverrideSlot = (slot: string) =>
    setOverrideSlots((p) => p.includes(slot) ? p.filter((s) => s !== slot) : [...p, slot].sort());

  const toggleOverrideService = (svc: string[]) => {
    const all = svc.every((s) => overrideSlots.includes(s));
    setOverrideSlots((p) => all ? p.filter((s) => !svc.includes(s)) : [...new Set([...p, ...svc])].sort());
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const weeks = useMemo<DayInfo[][]>(() => {
    const rows: DayInfo[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) rows.push(calendarDays.slice(i, i + 7));
    return rows;
  }, [calendarDays]);

  const selectedDayInfo = calendarDays.find((d) => d.date === selectedDate) ?? null;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminNav />

      <main className="px-4 py-6 max-w-7xl mx-auto space-y-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Réservations
          </h1>
          <div className="flex items-center gap-2">
            <Button variant={showSettings ? 'default' : 'outline'} size="sm"
              onClick={() => setShowSettings((v) => !v)}
              className={showSettings ? 'bg-primary/20 text-primary border-primary/40' : 'border-primary/30 text-foreground'}>
              <Settings size={14} className="mr-1" />Paramètres
            </Button>
          </div>
        </div>

        {/* ── Settings panel ── */}
        {showSettings && (
          <div className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                Paramètres globaux
              </h2>
              <Button variant="ghost" size="sm"
                onClick={() => { if (settings) { setEditMaxCovers(settings.maxCovers); setEditDepositPerGuest(String(Math.round((settings.depositPerGuestCents ?? 2000) / 100))); setEditMealDuration(settings.mealDuration); setEditSlots(settings.openingSlots); setEditDays(settings.openingDays); } setShowSettings(false); }}
                className="text-muted-foreground hover:text-foreground"><X size={14} /></Button>
            </div>

            {/* Opening days */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Jours d&apos;ouverture</label>
              <p className="text-xs text-muted-foreground">Jours habituellement ouverts (surchargeable jour par jour).</p>
              <div className="flex gap-1.5 flex-wrap">
                {WEEK_ORDER.map((dow) => {
                  const active = editDays.includes(dow);
                  return (
                    <button key={dow} type="button"
                      onClick={() => setEditDays((p) => p.includes(dow) ? p.filter((d) => d !== dow) : [...p, dow])}
                      className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${active ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-background/30 border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}>
                      {DAYS_SHORT[dow]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max covers */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Couverts maximum par créneau</label>
              <p className="text-xs text-muted-foreground">Au-delà de ce nombre, le créneau est complet.</p>
              <Input type="number" min={1} max={500} value={editMaxCovers}
                onChange={(e) => setEditMaxCovers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 bg-background/30 border-primary/30 text-foreground" />
            </div>

            {/* Deposit per guest */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Acompte par couvert</label>
              <p className="text-xs text-muted-foreground">Montant en euros débité au moment de la réservation, déduit de l’addition le soir de la venue.</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number" min={0} max={500}
                  value={editDepositPerGuest}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setEditDepositPerGuest(raw);
                  }}
                  className={`w-32 bg-background/30 border-primary/30 text-foreground${
                    editDepositPerGuest !== '' && (isNaN(Number(editDepositPerGuest)) || Number(editDepositPerGuest) < 0 || Number(editDepositPerGuest) > 500)
                      ? ' border-destructive'
                      : ''
                  }`} />
                <span className="text-sm text-muted-foreground">€ / couvert</span>
              </div>
            </div>
            {/* Meal duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Durée d&apos;un repas</label>
              <p className="text-xs text-muted-foreground">Détermine l&apos;heure de fermeture affichée (dernier créneau + durée).</p>
              <div className="flex gap-1.5 flex-wrap">
                {[30, 60, 90, 120, 150, 180].map((mins) => (
                  <button key={mins} type="button"
                    onClick={() => setEditMealDuration(mins)}
                    className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${editMealDuration === mins
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-background/30 border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}>
                    {mins < 60 ? `${mins}min` : mins % 60 === 0 ? `${mins / 60}h` : `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}`}
                  </button>
                ))}
              </div>
            </div>
            {/* Opening slots */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Horaires d&apos;ouverture</label>
              <p className="text-xs text-muted-foreground">Créneaux proposés lors d&apos;une journée normale.</p>
              <div className="grid sm:grid-cols-2 gap-6">
                {Object.entries(ALL_SLOTS).map(([service, slots]) => {
                  const allSel = slots.every((s) => editSlots.includes(s));
                  const someSel = slots.some((s) => editSlots.includes(s));
                  return (
                    <div key={service} className="space-y-2">
                      <button type="button" onClick={() => toggleService(slots)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide hover:opacity-80 transition-opacity">
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${allSel ? 'bg-primary border-primary' : someSel ? 'bg-primary/40 border-primary/40' : 'border-primary/40'
                          }`}>
                          {(allSel || someSel) && <CheckSquare size={10} className="text-background" />}
                        </span>{service}
                      </button>
                      <div className="grid grid-cols-4 gap-1.5">
                        {slots.map((slot) => {
                          const active = editSlots.includes(slot);
                          return (
                            <button key={slot} type="button" onClick={() => toggleSlot(slot)}
                              className={`text-xs px-2 py-1.5 rounded border transition-colors ${active ? 'bg-primary/20 border-primary/50 text-primary font-medium' : 'bg-background/30 border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                }`}>{slot}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {editSlots.length} créneau{editSlots.length !== 1 ? 'x' : ''} &middot; {editDays.length} jour{editDays.length !== 1 ? 's' : ''}/semaine
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-primary/10">
              <Button onClick={saveSettings} disabled={savingSettings || editDepositPerGuest === '' || isNaN(Number(editDepositPerGuest)) || Number(editDepositPerGuest) < 0 || Number(editDepositPerGuest) > 500}
                className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30" size="sm">
                {savingSettings ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
                {settingsSaved ? 'Enregistré ✓' : 'Enregistrer'}
              </Button>
              {settings && (
                <span className="text-xs text-muted-foreground">
                  Actuellement : {settings.openingDays.length}j/sem &middot; {settings.maxCovers} cvrt &middot;
                  {settings.mealDuration < 60 ? `${settings.mealDuration}min` : settings.mealDuration % 60 === 0 ? `${settings.mealDuration / 60}h` : `${Math.floor(settings.mealDuration / 60)}h${String(settings.mealDuration % 60).padStart(2, '0')}`}/repas &middot;
                  {settings.openingSlots.length} créneaux
                </span>
              )}
            </div>
          </div>
        )}

        {/* ══ CALENDAR VIEW ══════════════════════════════════════════════════════ */}
        <div className="space-y-3">

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"
              onClick={() => setCurrentMonth((m) => m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 })}
              className="border-primary/30 text-foreground"><ChevronLeft size={15} /></Button>
            <span className="text-sm font-medium text-foreground min-w-[160px] text-center capitalize">
              {MONTHS_FULL[currentMonth.month]} {currentMonth.year}
            </span>
            <Button variant="outline" size="sm"
              onClick={() => setCurrentMonth((m) => m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 })}
              className="border-primary/30 text-foreground"><ChevronRight size={15} /></Button>
            <div className="flex gap-1 ml-auto">
              <Button variant="ghost" size="sm" onClick={() => { const n = new Date(); setCurrentMonth({ year: n.getFullYear(), month: n.getMonth() }); setSelectedDate(null); }}
                className="text-muted-foreground hover:text-foreground text-xs">
                <RotateCcw size={11} className="mr-1" />Aujourd&apos;hui
              </Button>
              <Button variant="ghost" size="sm" onClick={fetchCalendar}
                className="text-muted-foreground hover:text-foreground text-xs">
                <RefreshCw size={11} className="mr-1" />Actualiser
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {WEEK_ORDER.map((dow) => (
              <div key={dow} className="text-center text-xs font-medium text-muted-foreground py-1">
                {DAYS_SHORT[dow]}
              </div>
            ))}
          </div>

          {/* Grid */}
          {calendarLoading ? (
            <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day) => {
                    const today = isToday(day.date);
                    const selected = day.date === selectedDate;
                    const fillPct = day.totalCapacity > 0
                      ? Math.min(100, Math.round((day.reservedGuests / day.totalCapacity) * 100))
                      : 0;
                    const almostFull = fillPct >= 75;
                    const full = fillPct >= 100;

                    return (
                      <button key={day.date} type="button"
                        onClick={() => setSelectedDate(selected ? null : day.date)}
                        className={`relative p-2 rounded-lg border text-left transition-all min-h-[96px] flex flex-col ${selected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                          : today
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-primary/10 bg-card hover:border-primary/30 hover:bg-card/80'
                          }`}>

                        {/* Date */}
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold ${today ? 'text-primary' : 'text-foreground/80'}`}>
                            {formatCardDate(day.date)}
                          </span>
                          {day.hasOverride && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-600/20 text-amber-400 border border-amber-600/30 leading-none">&#10033;</span>
                          )}
                        </div>

                        {/* Content */}
                        {day.effectiveOpen ? (
                          <div className="flex-1 space-y-0.5">
                            {day.lunchOpen && (
                              <div className="text-[10px] text-muted-foreground leading-tight">
                                &#127774; {day.lunchOpen}&ndash;{day.lunchClose}
                              </div>
                            )}
                            {day.dinnerOpen && (
                              <div className="text-[10px] text-muted-foreground leading-tight">
                                &#127769; {day.dinnerOpen}&ndash;{day.dinnerClose}
                              </div>
                            )}
                            {day.totalCapacity > 0 && (
                              <div className="mt-auto pt-1.5 space-y-0.5">
                                <div className="w-full h-1 rounded-full bg-primary/10 overflow-hidden">
                                  <div className={`h-full rounded-full ${full ? 'bg-red-500' : almostFull ? 'bg-amber-500' : 'bg-green-500'}`}
                                    style={{ width: `${fillPct}%` }} />
                                </div>
                                <div className={`text-[10px] ${full ? 'text-red-400' : almostFull ? 'text-amber-400' : 'text-muted-foreground'}`}>
                                  {day.reservedGuests}/{day.totalCapacity} cvrt
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Fermé</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ── Day detail panel ── */}
          {selectedDate && selectedDayInfo && (
            <div className="bg-card border border-primary/20 rounded-xl overflow-hidden mt-2">

              {/* Header */}
              <div className="px-5 py-3.5 border-b border-primary/10 flex items-center justify-between bg-card/50">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-semibold capitalize" style={{ fontFamily: 'var(--font-display)' }}>
                    {formatFullDate(selectedDate)}
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded border ${selectedDayInfo.effectiveOpen
                    ? 'bg-green-600/20 text-green-400 border-green-600/30'
                    : 'bg-red-600/20 text-red-400 border-red-600/30'
                    }`}>
                    {selectedDayInfo.effectiveOpen ? 'OUVERT' : 'FERMÉ'}
                  </span>
                  {selectedDayInfo.hasOverride && (
                    <span className="text-xs px-2 py-0.5 rounded border bg-amber-600/20 text-amber-400 border-amber-600/30">
                      Override actif
                    </span>
                  )}
                  {selectedDayInfo.effectiveOpen && (
                    <span className="text-xs text-muted-foreground">
                      {selectedDayInfo.reservedGuests} / {selectedDayInfo.totalCapacity} couverts réservés
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"><X size={14} /></Button>
              </div>

              <div className="grid lg:grid-cols-[360px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-primary/10">

                {/* ── Override panel ── */}
                <div className="p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Override du jour</h3>

                  <div className="flex flex-col gap-1.5">
                    {([
                      { mode: 'global' as const, label: 'Suivre les paramètres globaux', emoji: '🌐' },
                      { mode: 'closed' as const, label: 'Fermer ce jour', emoji: '🔒' },
                      { mode: 'custom' as const, label: 'Horaires personnalisés', emoji: '✏️' },
                    ]).map(({ mode, label, emoji }) => (
                      <button key={mode} type="button"
                        onClick={() => {
                          if (mode === 'custom' && overrideMode !== 'custom') {
                            setOverrideMaxCovers(selectedDayInfo.effectiveMaxCovers);
                            setOverrideSlots(selectedDayInfo.effectiveSlots);
                          }
                          setOverrideMode(mode);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm transition-colors text-left ${overrideMode === mode
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'border-primary/10 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                          }`}>
                        <span className="w-5 text-center text-base">{emoji}</span>{label}
                        {overrideMode === mode && <span className="ml-auto text-primary text-xs">✓</span>}
                      </button>
                    ))}
                  </div>

                  {overrideMode === 'custom' && (
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Couverts max par créneau</label>
                        <Input type="number" min={1} max={500} value={overrideMaxCovers}
                          onChange={(e) => setOverrideMaxCovers(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-28 bg-background/30 border-primary/30 text-foreground h-8 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Créneaux</label>
                        <div className="space-y-3">
                          {Object.entries(ALL_SLOTS).map(([service, slots]) => {
                            const allSel = slots.every((s) => overrideSlots.includes(s));
                            const someSel = slots.some((s) => overrideSlots.includes(s));
                            return (
                              <div key={service} className="space-y-1.5">
                                <button type="button" onClick={() => toggleOverrideService(slots)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide hover:opacity-80">
                                  <span className={`w-3 h-3 rounded border flex items-center justify-center ${allSel ? 'bg-primary border-primary' : someSel ? 'bg-primary/40 border-primary/40' : 'border-primary/40'
                                    }`}>
                                    {(allSel || someSel) && <CheckSquare size={8} className="text-background" />}
                                  </span>{service}
                                </button>
                                <div className="grid grid-cols-4 gap-1">
                                  {slots.map((slot) => {
                                    const active = overrideSlots.includes(slot);
                                    return (
                                      <button key={slot} type="button" onClick={() => toggleOverrideSlot(slot)}
                                        className={`text-xs px-1.5 py-1 rounded border transition-colors ${active ? 'bg-primary/20 border-primary/50 text-primary font-medium' : 'bg-background/30 border-primary/20 text-muted-foreground hover:border-primary/40'
                                          }`}>{slot}</button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">{overrideSlots.length} créneau{overrideSlots.length !== 1 ? 'x' : ''}</p>
                      </div>
                    </div>
                  )}

                  {overrideMode === 'closed' && (
                    <div className="flex items-start gap-2 text-xs text-red-400/80 bg-red-600/10 border border-red-600/20 rounded-lg px-3 py-2.5">
                      <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                      Ce jour sera fermé quelle que soit la configuration globale.
                    </div>
                  )}

                  {overrideMode === 'global' && selectedDayInfo.hasOverride && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/30 border border-primary/10 rounded-lg px-3 py-2.5">
                      <RotateCcw size={13} className="mt-0.5 flex-shrink-0" />
                      Enregistrer supprimera l&apos;override et restaurera les paramètres globaux.
                    </div>
                  )}

                  <Button onClick={saveOverride} disabled={savingOverride}
                    className="w-full bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30" size="sm">
                    {savingOverride ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
                    {overrideSaved ? 'Enregistré ✓' : 'Enregistrer'}
                  </Button>
                </div>

                {/* ── Reservations ── */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Réservations ({selectedDayInfo.reservationCount})
                  </h3>

                  {dayLoading ? (
                    <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-primary" /></div>
                  ) : dayReservations.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">Aucune réservation ce jour.</p>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {dayReservations.map((r) => (
                        <div key={r.id} className="bg-background/30 border border-primary/10 rounded-lg px-3 py-2.5 flex items-start gap-3">
                          <div className="text-sm font-semibold text-primary tabular-nums mt-0.5 min-w-[38px]">
                            {formatTime(r.date)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-sm">{r.name}</span>
                              <span className="text-xs text-muted-foreground">{r.guests} cvrt{r.guests > 1 ? 's' : ''}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border leading-none ${STATUS_COLORS[r.status]}`}>
                                {STATUS_LABELS[r.status]}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{r.phone} &middot; {r.email}</div>
                            {r.specialRequest && (
                              <div className="text-xs text-amber-400/70 truncate mt-0.5">&#8627; {r.specialRequest}</div>
                            )}

                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {r.status === 'CONFIRMED' && (
                              <Button size="sm" variant="outline"
                                onClick={() => {
                                  if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
                                  updateStatus(r.id, 'CANCELLED', selectedDate ?? undefined);
                                }}
                                className="text-red-400 border-red-600/30 hover:bg-red-600/10 px-3 text-xs">Annuler</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>


      </main>
    </div>
  );
}
