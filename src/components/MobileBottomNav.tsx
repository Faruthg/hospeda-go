import React from 'react';
import { Building2, Map, Compass, Car, CalendarCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'stays' | 'experiences' | 'rides' | 'bookings';
  setActiveTab: (tab: 'stays' | 'experiences' | 'rides' | 'bookings') => void;
  isMapVisible: boolean;
  setIsMapVisible: (show: boolean) => void;
  unreadCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  isMapVisible,
  setIsMapVisible,
  unreadCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-3">
      <div className="flex items-center justify-around text-[10px] font-semibold text-slate-500 dark:text-slate-400">
        
        {/* Stays */}
        <button
          onClick={() => {
            setActiveTab('stays');
            setIsMapVisible(false);
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'stays' && !isMapVisible ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Explorar</span>
        </button>

        {/* Map Toggle */}
        <button
          onClick={() => {
            setActiveTab('stays');
            setIsMapVisible(!isMapVisible);
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'stays' && isMapVisible ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Map className="w-5 h-5" />
          <span>{isMapVisible ? 'Lista' : 'Mapa'}</span>
        </button>

        {/* Experiences */}
        <button
          onClick={() => {
            setActiveTab('experiences');
            setIsMapVisible(false);
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'experiences' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Tours</span>
        </button>

        {/* Rides */}
        <button
          onClick={() => {
            setActiveTab('rides');
            setIsMapVisible(false);
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'rides' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Car className="w-5 h-5" />
          <span>Rides</span>
        </button>

        {/* Reservations */}
        <button
          onClick={() => {
            setActiveTab('bookings');
            setIsMapVisible(false);
          }}
          className={`relative flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'bookings' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span>Reservas</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

      </div>
    </div>
  );
};
