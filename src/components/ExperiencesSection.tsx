import React, { useState } from 'react';
import { 
  Compass, 
  Star, 
  Clock, 
  MapPin, 
  Users, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { Experience } from '../types';
import { soundManager } from '../utils/audio';

interface ExperiencesSectionProps {
  experiences: Experience[];
  onBookExperience: (experience: Experience, time: string, spots: number) => boolean;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  experiences,
  onBookExperience
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeExp, setActiveExp] = useState<Experience | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [selectedSpots, setSelectedSpots] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filtered = selectedCategory === 'all'
    ? experiences
    : experiences.filter(exp => exp.category === selectedCategory);

  const handleOpenBooking = (exp: Experience) => {
    setActiveExp(exp);
    setSelectedSchedule(exp.schedule[0] || '10:00 AM');
    setSelectedSpots(1);
    setBookingSuccess(false);
  };

  const handleConfirm = () => {
    if (!activeExp) return;
    if (!onBookExperience(activeExp, selectedSchedule, selectedSpots)) return;
    soundManager.playCashRegister();
    setBookingSuccess(true);
    setTimeout(() => {
      setActiveExp(null);
      setBookingSuccess(false);
    }, 2200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title & Preferences Filter Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Experiencias &amp; Actividades Culturales Locales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Inmersiones auténticas guiadas por expertos locales certificados y artesanos de la zona.
            </p>
          </div>
        </div>

        {/* User Preferences Category Filter (§1.A Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-4">
          {[
            { id: 'all', label: 'Todas las Experiencias' },
            { id: 'gastronomy', label: 'Gastronomía & Vinos' },
            { id: 'culture', label: 'Arte & Patrimonio' },
            { id: 'adventure', label: 'Aventura & Mar' },
            { id: 'nightlife', label: 'Vida Nocturna & Música' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(exp => (
          <div
            key={exp.id}
            onClick={() => handleOpenBooking(exp)}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={exp.photo}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-900 dark:text-white shadow-xs">
                  {exp.categoryLabel}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {exp.rating} ({exp.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {exp.duration}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {exp.title}
                </h3>

                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                  <img
                    src={exp.guide.avatar}
                    alt={exp.guide.name}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate">{exp.guide.name}</span>
                  {exp.guide.certified && (
                    <span title="Guía Certificado">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between text-xs">
              <div>
                <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ${exp.price}
                </span>
                <span className="text-slate-500 ml-1">/ persona</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {exp.spotsLeft} plazas disp.
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Experience Booking Modal */}
      {activeExp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {activeExp.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeExp.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveExp(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  ¡Plaza de Experiencia Reservada!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Hemos notificado a tu anfitrión {activeExp.guide.name}. Revisa tu panel y teléfono para ver los detalles del punto de encuentro.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeExp.description}
                </p>

                {/* What's included */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Qué incluye esta experiencia
                  </h4>
                  <div className="space-y-1.5">
                    {activeExp.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Horario disponible
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeExp.schedule.map((time, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSchedule(time)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSchedule === time
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spots stepper & Total */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Número de plazas</span>
                    <span className="text-slate-500">${activeExp.price} x {selectedSpots}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedSpots(Math.max(1, selectedSpots - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm tabular-nums">{selectedSpots}</span>
                    <button
                      onClick={() => setSelectedSpots(Math.min(activeExp.spotsLeft, selectedSpots + 1))}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Total a pagar</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      ${activeExp.price * selectedSpots} USD
                    </span>
                  </div>

                  <button
                    onClick={handleConfirm}
                    className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Confirmar Experiencia
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
