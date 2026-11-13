import React from 'react';
import { CalendarCheck, Car, Compass, Home, LogIn } from 'lucide-react';
import { AuthUser, Booking, GuestReservation } from '../types';

interface GuestReservationsProps {
  user: AuthUser | null;
  bookings: Booking[];
  serviceReservations: GuestReservation[];
  onOpenAuth: () => void;
}

export const GuestReservations: React.FC<GuestReservationsProps> = ({
  user,
  bookings,
  serviceReservations,
  onOpenAuth
}) => {
  const reservations = [
    ...bookings.map(booking => ({
      id: booking.id,
      title: booking.propertyTitle,
      type: 'stay' as const,
      details: `${booking.checkIn} – ${booking.checkOut} · ${booking.guests} huéspedes · Código ${booking.bookingCode}`,
      amount: booking.totalAmount,
      createdAt: booking.createdAt
    })),
    ...serviceReservations.map(reservation => ({
      id: reservation.id,
      title: reservation.title,
      type: reservation.type,
      details: reservation.details,
      amount: reservation.amount,
      createdAt: reservation.createdAt
    }))
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mis reservas</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Alojamientos, experiencias y transportes asociados a tu cuenta.
        </p>
      </div>

      {!user ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">Inicia sesión para consultar tus reservas.</p>
          <button onClick={onOpenAuth} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">
            <LogIn className="w-4 h-4" /> Iniciar sesión
          </button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500">
          Todavía no tienes reservas. Explora y elige tu próximo plan.
        </div>
      ) : (
        <div className="grid gap-3">
          {reservations.map(reservation => (
            <article key={reservation.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                {reservation.type === 'stay' ? <Home className="w-5 h-5" /> : reservation.type === 'experience' ? <Compass className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-bold text-slate-900 dark:text-white">{reservation.title}</h2>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">${reservation.amount.toLocaleString('es-CO')}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{reservation.details}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold mt-2">Reserva confirmada · {reservation.createdAt.slice(0, 10)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
