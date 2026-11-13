import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  MapPin, 
  Star, 
  Building2, 
  Home, 
  Compass, 
  Layers, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Property } from '../types';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  hoveredPropertyId?: string | null;
  onHoverProperty?: (id: string | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  hoveredPropertyId,
  onHoverProperty
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [mapTheme, setMapTheme] = useState<'streets' | 'satellite' | 'minimal'>('streets');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map coordinate boundary projections
  const minLat = 36.410;
  const maxLat = 36.455;
  const minLng = 25.400;
  const maxLng = 25.455;

  const projectToMap = (lat: number, lng: number) => {
    const xPct = ((lng - minLng) / (maxLng - minLng)) * 100;
    const yPct = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      left: `${Math.max(8, Math.min(92, xPct))}%`,
      top: `${Math.max(10, Math.min(88, yPct))}%`
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.0, Math.max(0.7, prev + delta)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 dark:bg-slate-950 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 select-none">
      
      {/* Interactive Map Canvas Container */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute inset-0 transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {/* Map Base Canvas with stylized terrain and roads */}
          <div className={`w-full h-full relative ${
            mapTheme === 'satellite' 
              ? 'bg-[#1a2e3b]' 
              : mapTheme === 'minimal' 
              ? 'bg-[#f4f3ef] dark:bg-[#12161f]' 
              : 'bg-[#e5e9ec] dark:bg-[#18202c]'
          }`}>
            
            {/* SVG Roads & Coastline Topography */}
            <svg className="w-full h-full absolute inset-0 opacity-70" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Coastline / Water Bay Curve */}
              <path 
                d="M -50,120 Q 200,80 400,260 T 900,420 L 1200,600 L 0,800 Z" 
                className={mapTheme === 'satellite' ? 'fill-sky-950/70' : 'fill-sky-100 dark:fill-sky-950/40'} 
              />
              
              {/* Primary Avenue Highways */}
              <path 
                d="M 50,0 Q 220,250 500,320 T 1100,500" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="7" 
                strokeLinecap="round" 
                className="text-white dark:text-slate-700/80" 
              />
              <path 
                d="M 50,0 Q 220,250 500,320 T 1100,500" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round" 
                className="text-amber-100 dark:text-slate-800" 
              />

              {/* Secondary Boulevard */}
              <path 
                d="M 300,50 L 750,450" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="text-white dark:text-slate-700/60" 
              />

              {/* Connecting local streets */}
              <path d="M 180,180 L 350,220 M 420,260 L 620,180 M 520,380 L 820,310 M 240,400 L 480,480" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                className="text-slate-300/80 dark:text-slate-700/40" 
              />

              {/* Neighborhood Parks / Greenery */}
              <circle cx="280" cy="220" r="55" className="fill-emerald-100/70 dark:fill-emerald-950/30" />
              <rect x="620" y="140" width="120" height="80" rx="20" className="fill-emerald-100/60 dark:fill-emerald-950/20" />
            </svg>

            {/* Neighborhood Labels */}
            <div className="absolute top-[18%] left-[22%] pointer-events-none text-xs font-semibold uppercase tracking-wider text-slate-500/80 dark:text-slate-400/60">
              Distrito Histórico
            </div>
            <div className="absolute top-[48%] left-[62%] pointer-events-none text-xs font-semibold uppercase tracking-wider text-slate-500/80 dark:text-slate-400/60">
              Bahía &amp; Paseo Marítimo
            </div>
            <div className="absolute top-[72%] left-[30%] pointer-events-none text-xs font-semibold uppercase tracking-wider text-slate-500/80 dark:text-slate-400/60">
              Distrito Creativo &amp; Cowork
            </div>

            {/* Property Pins */}
            {properties.map(property => {
              const pos = projectToMap(property.lat, property.lng);
              const isSelected = selectedProperty?.id === property.id;
              const isHovered = hoveredPropertyId === property.id;

              const getTypeBadgeColor = () => {
                if (property.type === 'hotel') return 'bg-blue-600 text-white';
                if (property.type === 'hostel') return 'bg-amber-600 text-white';
                return 'bg-slate-900 text-white dark:bg-white dark:text-slate-900';
              };

              return (
                <div
                  key={property.id}
                  className="absolute transition-transform duration-200 z-10"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => onHoverProperty && onHoverProperty(property.id)}
                  onMouseLeave={() => onHoverProperty && onHoverProperty(null)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProperty(property);
                    }}
                    className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-all ${
                      isSelected || isHovered
                        ? 'scale-115 ring-3 ring-emerald-500 z-30 shadow-xl ' + getTypeBadgeColor()
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:scale-105'
                    }`}
                  >
                    <span className="tabular-nums">${property.pricePerNight}</span>
                    {property.type === 'hostel' && (
                      <span className="text-[10px] opacity-75">cama</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleZoom(0.25)}
          className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Acercar mapa"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.25)}
          className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Alejar mapa"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Centrar vista"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Layer Mode Switcher */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setMapTheme('streets')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapTheme === 'streets' 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Callejero
        </button>
        <button
          onClick={() => setMapTheme('satellite')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapTheme === 'satellite' 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Satélite
        </button>
      </div>

      {/* Selected Property Floating Preview Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div 
            onClick={() => onSelectProperty(selectedProperty)}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-2xl flex gap-3 cursor-pointer hover:border-emerald-500 transition-all group"
          >
            <img 
              src={selectedProperty.photos[0]} 
              alt={selectedProperty.title}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="capitalize">{selectedProperty.subType}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 font-bold text-slate-800 dark:text-slate-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    {selectedProperty.rating}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  {selectedProperty.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {selectedProperty.neighborhood}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ${selectedProperty.pricePerNight} <span className="text-[10px] font-normal text-slate-500">/ noche</span>
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                  Ver detalle <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
