import React, { useState } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isHovered?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isHovered = false
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % property.photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getTypeLabel = () => {
    switch (property.type) {
      case 'hotel':
        return 'Hotel Boutique';
      case 'hostel':
        return 'Hostal Comunitario';
      default:
        return 'Espacio Entero';
    }
  };

  return (
    <div
      onClick={() => onSelect(property)}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 bg-white dark:bg-slate-900 ${
        isHovered
          ? 'ring-2 ring-emerald-500 shadow-xl border-transparent -translate-y-1'
          : 'border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {/* Photo Carousel Area */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={property.photos[photoIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          referrerPolicy="no-referrer"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-xs text-white transition-colors"
          title={isFavorite ? 'Quitar de guardados' : 'Guardar en favoritos'}
          aria-label="Favorito"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'
            }`}
          />
        </button>

        {/* Carousel Arrow Controls */}
        {property.photos.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-slate-800 dark:text-slate-100 hover:scale-110 transition-transform"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-slate-800 dark:text-slate-100 hover:scale-110 transition-transform"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Carousel Dots indicator */}
        {property.photos.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
            {property.photos.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === photoIndex ? 'bg-white w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content - Clean Unboxed Metadata (§1.A Zero-Pill Rule) */}
      <div className="p-4">
        {/* Unboxed Metadata line with typographic separators */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{getTypeLabel()}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{property.neighborhood}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-900 dark:text-white shrink-0 font-bold tabular-nums">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{property.rating.toFixed(2)}</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              ({property.reviewCount})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {property.title}
        </h3>

        {/* Capacity & Host info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Hasta {property.maxGuests} huéspedes</span>
          <span aria-hidden="true">·</span>
          <span>{property.bedrooms} {property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}</span>
          {property.host.isSuperhost && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                Superanfitrión
              </span>
            </>
          )}
        </div>

        {/* Price Baseline with Tabular Figures */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
            <span className="text-base font-extrabold tabular-nums">
              ${property.pricePerNight}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {property.type === 'hostel' ? '/ cama · noche' : '/ noche'}
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Ver disponibilidad &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
