import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Star, 
  Bus, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { RIDE_TIERS } from '../data/mockData';
import { ActiveRide } from '../types';
import { soundManager } from '../utils/audio';

interface TransportRideSectionProps {
  onRideBooked: (ride: ActiveRide) => boolean;
}

export const TransportRideSection: React.FC<TransportRideSectionProps> = ({
  onRideBooked
}) => {
  const [pickup, setPickup] = useState('Aeropuerto Internacional (Terminal 1)');
  const [dropoff, setDropoff] = useState('Villa Panorámica (Acantilados de Imerovigli)');
  const [distanceKm, setDistanceKm] = useState(14.5);
  const [selectedTier, setSelectedTier] = useState<'eco' | 'comfort' | 'van' | 'moto'>('comfort');
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  // Simulation timer for the live ride
  useEffect(() => {
    if (!activeRide) return;

    if (activeRide.status === 'searching') {
      const timer = setTimeout(() => {
        soundManager.playChime();
        setActiveRide(prev => prev ? {
          ...prev,
          status: 'driver_assigned',
          progressPercent: 25,
          etaMinutes: 4
        } : null);
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (activeRide.status === 'driver_assigned') {
      const timer = setTimeout(() => {
        setActiveRide(prev => prev ? {
          ...prev,
          status: 'in_transit',
          progressPercent: 65,
          etaMinutes: 2
        } : null);
      }, 3500);
      return () => clearTimeout(timer);
    }

    if (activeRide.status === 'in_transit') {
      const timer = setTimeout(() => {
        soundManager.playCarHorn();
        setActiveRide(prev => prev ? {
          ...prev,
          status: 'arrived',
          progressPercent: 100,
          etaMinutes: 0
        } : null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeRide?.status]);

  const currentTier = RIDE_TIERS.find(t => t.id === selectedTier) || RIDE_TIERS[1];
  const calculatedFare = Math.round((currentTier.basePrice + distanceKm * currentTier.perKm) * 10) / 10;
  const estimatedDurationMinutes = Math.round(distanceKm * 2.2);

  const handleRequestRide = () => {
    const newRide: ActiveRide = {
      id: `ride-${Date.now()}`,
      serviceType: selectedTier,
      typeName: currentTier.name,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      distanceKm,
      fare: calculatedFare,
      etaMinutes: 6,
      status: 'searching',
      driver: {
        name: 'Javier Morales',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
        rating: 4.96,
        phone: '+34 612 890 231',
        vehicle: selectedTier === 'comfort' ? 'Mercedes Clase E Negro' : selectedTier === 'van' ? 'Mercedes V-Class' : selectedTier === 'moto' ? 'Honda Forza 350' : 'Toyota Corolla Hybrid',
        plate: '7842-MBX'
      },
      progressPercent: 10,
      startTime: 'Ahora'
    };

    if (onRideBooked(newRide)) {
      soundManager.playCashRegister();
      setActiveRide(newRide);
    }
  };

  const handleCancelOrReset = () => {
    setActiveRide(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Hospeda Ride · Transporte Privado Asociado
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Traslados desde el aeropuerto, estaciones y viajes interurbanos con conductores verificados y tarifas transparentes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Booking / Route Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
          
          {activeRide ? (
            /* Live Active Ride Status Card */
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {activeRide.status === 'searching' && 'Buscando chofer cercano...'}
                    {activeRide.status === 'driver_assigned' && 'Chofer asignado · En camino'}
                    {activeRide.status === 'in_transit' && 'Vehículo en trayecto hacia ti'}
                    {activeRide.status === 'arrived' && '¡Tu conductor ha llegado!'}
                  </span>
                </div>
                <button
                  onClick={handleCancelOrReset}
                  className="text-xs text-rose-500 hover:underline font-semibold"
                >
                  {activeRide.status === 'arrived' ? 'Nuevo Viaje' : 'Cancelar'}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Progreso de aproximación</span>
                  <span className="tabular-nums font-bold text-slate-900 dark:text-white">
                    {activeRide.status === 'arrived' ? 'Llegada inmediata' : `${activeRide.etaMinutes} min`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-700 ease-out"
                    style={{ width: `${activeRide.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Driver Details Card */}
              {activeRide.status !== 'searching' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={activeRide.driver.avatar} 
                        alt={activeRide.driver.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {activeRide.driver.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{activeRide.driver.rating}</span>
                          <span>· Chofer Oro</span>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={`tel:${activeRide.driver.phone}`}
                      className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs"
                      title="Llamar al conductor"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehículo</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRide.driver.vehicle}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Matrícula</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{activeRide.driver.plate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Summary */}
              <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400 pt-2">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recogida</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{activeRide.pickupAddress}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destino</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{activeRide.dropoffAddress}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Tarifa Cerrada</span>
                  <span className="tabular-nums">${activeRide.fare.toFixed(2)} USD</span>
                </div>
              </div>

            </div>
          ) : (
            /* Booking Form */
            <>
              {/* Pickup & Destination Inputs */}
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Punto de Recogida
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Destino (Alojamiento o Atracción)
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white shrink-0" />
                    <input
                      type="text"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
                  <span className="text-slate-400">Rápidos:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPickup('Aeropuerto Internacional');
                      setDropoff('Villa Panorámica (Santorini)');
                      setDistanceKm(14.5);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                  >
                    Aeropuerto &rarr; Villa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPickup('Estación de Tren Sants');
                      setDropoff('Grand Suite Nórdica');
                      setDistanceKm(5.8);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                  >
                    Estación &rarr; Hotel
                  </button>
                </div>
              </div>

              {/* Ride Tiers Selector */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Selecciona la Categoría de Vehículo
                </label>

                <div className="space-y-2">
                  {RIDE_TIERS.map(tier => {
                    const isSelected = selectedTier === tier.id;
                    const tierFare = Math.round((tier.basePrice + distanceKm * tier.perKm) * 10) / 10;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                            {tier.id === 'van' ? <Bus className="w-5 h-5" /> : tier.id === 'moto' ? <Zap className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {tier.name}
                              {tier.id === 'comfort' && (
                                <span className="text-[10px] font-semibold text-emerald-600">Recomendado</span>
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {tier.capacity} · {estimatedDurationMinutes} min
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                            ${tierFare.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">USD</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRequestRide}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                <span>Solicitar Chofer Privado (${calculatedFare.toFixed(2)} USD)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Tarifa garantizada sin sorpresas
                </span>
                <span>Distancia: {distanceKm} km</span>
              </div>
            </>
          )}

        </div>

        {/* Right Area: Interactive Live Mobility Map & Driver Route (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 h-[520px] relative overflow-hidden flex flex-col justify-between p-6">
          
          {/* Animated SVG Route Map */}
          <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ride-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ride-grid)" />

            {/* Simulated Road Highway */}
            <path 
              d="M 60,80 C 180,140 240,320 480,240 S 720,440 850,380" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              className="text-white dark:text-slate-700/60" 
            />
            {/* Active GPS Route in Emerald */}
            <path 
              d="M 60,80 C 180,140 240,320 480,240 S 720,440 850,380" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeDasharray="8 6" 
              className="text-emerald-500 animate-pulse" 
            />
          </svg>

          {/* Floating Markers */}
          {/* Pickup Pin */}
          <div className="absolute top-[14%] left-[10%] z-10 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Recogida: Aeropuerto</span>
          </div>

          {/* Dropoff Pin */}
          <div className="absolute bottom-[20%] right-[10%] z-10 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Destino: Tu Alojamiento</span>
          </div>

          {/* Moving Car Marker */}
          <div 
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{
              top: activeRide ? `${20 + (activeRide.progressPercent / 100) * 55}%` : '45%',
              left: activeRide ? `${15 + (activeRide.progressPercent / 100) * 65}%` : '45%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-slate-950 text-white shadow-2xl flex items-center justify-center ring-4 ring-emerald-500/40">
              <Car className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Map Top Indicator */}
          <div className="z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md self-start px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-emerald-500" />
            <span>Seguimiento GPS Satelital Activo</span>
          </div>

          {/* Map Bottom Information Strip */}
          <div className="z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Ruta Optimizada por Inteligencia Vial
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Sin peajes adicionales · Vehículos certificados con aire acondicionado
              </p>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm block tabular-nums">
                {estimatedDurationMinutes} min estimados
              </span>
              <span className="text-[10px] text-slate-400">Tráfico fluido</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
