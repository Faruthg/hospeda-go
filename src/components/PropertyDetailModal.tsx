import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  CreditCard,
  Wifi,
  Coffee,
  Waves,
  Utensils,
  Car,
  Tv,
  HelpCircle,
  Award
} from 'lucide-react';
import { Property, Booking } from '../types';
import { soundManager } from '../utils/audio';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBook: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'bookingCode' | 'status' | 'payoutStatus'>) => string | null;
  onStartChat: (property: Property) => void;
  onOpenReviews: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBook,
  onStartChat,
  onOpenReviews
}) => {
  const [checkIn, setCheckIn] = useState('2026-11-18');
  const [checkOut, setCheckOut] = useState('2026-11-22');
  const [guestCount, setGuestCount] = useState(2);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  if (!property) return null;

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(1000 * 60 * 60 * 24, d2.getTime() - d1.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 3;

  const nightlyTotal = property.pricePerNight * nights;
  const cleaningFee = property.cleaningFee;
  const serviceFee = Math.round(nightlyTotal * property.serviceFeeRate);
  const grandTotal = nightlyTotal + cleaningFee + serviceFee;

  const handleConfirmReservation = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const bookingCode = onBook({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyType: property.type,
        propertyPhoto: property.photos[0],
        checkIn,
        checkOut,
        guests: guestCount,
        totalNights: nights,
        nightlyTotal,
        cleaningFee,
        serviceFee,
        totalAmount: grandTotal,
        guestName: 'Tú (Huésped Verificado)',
        guestEmail: 'usuario@hospedago.com',
        guestAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        hostId: property.host.id
      });
      if (bookingCode) {
        soundManager.playCashRegister();
        setBookingSuccess(bookingCode);
      }
    }, 700);
  };

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (lower.includes('cocina')) return <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (lower.includes('piscina') || lower.includes('spa')) return <Waves className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (lower.includes('desayuno') || lower.includes('café')) return <Coffee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (lower.includes('aparcamiento') || lower.includes('coche')) return <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    if (lower.includes('tv')) return <Tv className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 lg:p-10">
      <div 
        className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Sticky Top Action Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {property.type === 'airbnb' ? 'Alojamiento Exclusivo' : property.type === 'hotel' ? 'Hotel Boutique' : 'Hostal & Social Co-Living'}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md font-medium">
              {property.city}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[82vh] overflow-y-auto">
          
          {/* Header Title & Ratings */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {property.title}
            </h1>
            
            {/* Clean Unboxed Metadata (§1.A) */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{property.rating}</span>
              </span>
              <span aria-hidden="true">·</span>
              <button 
                onClick={() => onOpenReviews(property)}
                className="underline hover:text-emerald-600 font-semibold cursor-pointer"
              >
                {property.reviewCount} reseñas verificadas
              </button>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {property.neighborhood}, {property.city}
              </span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={property.photos[activePhoto]} 
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {property.photos.slice(0, 3).map((photo, index) => (
                <div 
                  key={index} 
                  onClick={() => setActivePhoto(index)}
                  className={`aspect-16/10 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer border-2 transition-all ${
                    activePhoto === index ? 'border-emerald-500 scale-98' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={photo} 
                    alt={`Foto ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Contiguous Booking & Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2-Columns: Details & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Host Strip */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={property.host.avatar} 
                    alt={property.host.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      Anfitrión: {property.host.name}
                      {property.host.isSuperhost && (
                        <span title="Superanfitrión Verificado">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Responde en {property.host.responseTime} · Miembro desde {property.host.joinedYear}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartChat(property)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Chat Privado</span>
                </button>
              </div>

              {/* Space Capacity Strip */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex-1 min-w-[120px]">
                  <p className="text-slate-400 dark:text-slate-500">Capacidad</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {property.maxGuests} Personas
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex-1 min-w-[120px]">
                  <p className="text-slate-400 dark:text-slate-500">Dormitorios</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {property.bedrooms} {property.bedrooms === 1 ? 'Cuarto' : 'Cuartos'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex-1 min-w-[120px]">
                  <p className="text-slate-400 dark:text-slate-500">Baños</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {property.bathrooms} {property.bathrooms === 1 ? 'Baño' : 'Baños'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Acerca de este espacio
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Servicios y amenidades incluidas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Reviews Section Spotlight */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span>{property.rating} · Reseñas Verificadas ({property.reviews.length})</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Solo huéspedes que completaron su estancia pueden publicar valoraciones verificadas.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenReviews(property)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Ver todas / Añadir
                  </button>
                </div>

                <div className="space-y-4">
                  {property.reviews.slice(0, 2).map((rev) => (
                    <div 
                      key={rev.id} 
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rev.avatar} 
                            alt={rev.author}
                            className="w-10 h-10 rounded-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {rev.author}
                              {rev.verifiedStay && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                  <ShieldCheck className="w-3 h-3" />
                                  Huésped verificado
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {rev.date} · {rev.roomBooked}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{rev.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {rev.hostResponse && (
                        <div className="mt-3 pl-3 border-l-2 border-emerald-500 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-r-lg">
                          <span className="font-semibold text-slate-900 dark:text-white">Respuesta del anfitrión: </span>
                          {rev.hostResponse.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sticky Purchase Module (§2.A Contiguous PDP) */}
            <div className="lg:sticky lg:top-24 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              
              {/* Price Banner */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    ${property.pricePerNight}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    {property.type === 'hostel' ? '/ cama · noche' : '/ noche'}
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Cancelación gratuita</span>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    ¡Reserva Confirmada al Instante!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Código de reserva: <span className="font-mono font-bold">{bookingSuccess}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hemos enviado la notificación push a tu teléfono y activado el chat con el anfitrión.
                  </p>
                  <button
                    onClick={() => {
                      setBookingSuccess(null);
                      onClose();
                    }}
                    className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              ) : (
                <>
                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Llegada</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Salida</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Guests Selector */}
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Huéspedes</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none cursor-pointer mt-0.5"
                    >
                      {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n} className="dark:bg-slate-800">
                          {n} {n === 1 ? 'huésped' : 'huéspedes'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>${property.pricePerNight} x {nights} noches</span>
                      <span className="tabular-nums font-semibold">${nightlyTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarifa de limpieza</span>
                      <span className="tabular-nums font-semibold">${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarifa de servicio de plataforma (12%)</span>
                      <span className="tabular-nums font-semibold">${serviceFee}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                      <span>Total con tasas</span>
                      <span className="tabular-nums">${grandTotal} USD</span>
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <button
                    onClick={handleConfirmReservation}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Confirmar Reserva Inmediata</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                    No se te cobrará nada hasta la confirmación de la pasarela segura.
                  </p>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
