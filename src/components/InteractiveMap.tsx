import React, { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronRight, Minus, Plus, RotateCcw, Star } from 'lucide-react';
import { Property } from '../types';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  hoveredPropertyId?: string | null;
  onHoverProperty?: (id: string | null) => void;
}

interface MapViewportProps {
  properties: Property[];
  coordinatesKey: string;
  selectedProperty: Property | null;
}

const MapViewport: React.FC<MapViewportProps> = ({ properties, coordinatesKey, selectedProperty }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.flyTo([selectedProperty.lat, selectedProperty.lng], Math.max(map.getZoom(), 13), {
        duration: 0.5
      });
      return;
    }

    if (properties.length > 0) {
      map.fitBounds(
        L.latLngBounds(properties.map(property => [property.lat, property.lng])),
        { padding: [40, 40], maxZoom: 11 }
      );
    }
  }, [
    coordinatesKey,
    map,
    selectedProperty?.id,
    selectedProperty?.lat,
    selectedProperty?.lng
  ]);

  return null;
};

const MapControls: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const map = useMap();

  const recenter = () => {
    if (properties.length === 1) {
      map.setView([properties[0].lat, properties[0].lng], 13);
    } else if (properties.length > 1) {
      map.fitBounds(
        L.latLngBounds(properties.map(property => [property.lat, property.lng])),
        { padding: [40, 40], maxZoom: 11 }
      );
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900/95">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        title="Acercar mapa"
        aria-label="Acercar mapa"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        title="Alejar mapa"
        aria-label="Alejar mapa"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={recenter}
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        title="Ver todos los alojamientos"
        aria-label="Ver todos los alojamientos"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  hoveredPropertyId,
  onHoverProperty
}) => {
  const coordinatesKey = properties.map(property => `${property.lat},${property.lng}`).join(';');

  return (
    <div className="relative h-full min-h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
      <MapContainer
        center={[4.5, -73.5]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom
        className="z-0 h-full min-h-[480px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport
          properties={properties}
          coordinatesKey={coordinatesKey}
          selectedProperty={selectedProperty}
        />
        <MapControls properties={properties} />
        {properties.map(property => {
          const isSelected = selectedProperty?.id === property.id;
          const isHovered = hoveredPropertyId === property.id;
          const color = isSelected || isHovered ? '#059669' : '#0f172a';

          return (
            <CircleMarker
              key={property.id}
              center={[property.lat, property.lng]}
              radius={isSelected || isHovered ? 11 : 8}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 3 }}
              eventHandlers={{
                click: () => onSelectProperty(property),
                mouseover: () => onHoverProperty?.(property.id),
                mouseout: () => onHoverProperty?.(null)
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                ${property.pricePerNight} / noche
              </Tooltip>
              <Popup>
                <div className="max-w-56">
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-sm text-slate-500">{property.city}</p>
                  <p className="mt-1 font-bold">${property.pricePerNight} / noche</p>
                  <button
                    type="button"
                    onClick={() => onSelectProperty(property)}
                    className="mt-2 font-semibold text-emerald-700"
                  >
                    Ver alojamiento
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {selectedProperty && (
        <button
          type="button"
          onClick={() => onSelectProperty(selectedProperty)}
          className="absolute bottom-4 left-4 right-4 z-[1000] flex gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 text-left shadow-2xl transition-colors hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-900/95 sm:right-auto sm:max-w-sm"
        >
          <img
            src={selectedProperty.photos[0]}
            alt={selectedProperty.title}
            className="h-24 w-24 shrink-0 rounded-xl object-cover"
          />
          <span className="flex min-w-0 flex-1 flex-col justify-between">
            <span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="capitalize">{selectedProperty.subType}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 font-bold text-slate-800 dark:text-slate-200">
                  <Star className="inline h-3 w-3 fill-amber-400 text-amber-400" />
                  {selectedProperty.rating}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-xs font-bold text-slate-900 dark:text-white">
                {selectedProperty.title}
              </span>
              <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                {selectedProperty.neighborhood}
              </span>
            </span>
            <span className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 dark:border-slate-800">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                ${selectedProperty.pricePerNight}
                <span className="text-[10px] font-normal text-slate-500"> / noche</span>
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Ver detalle <ChevronRight className="h-3 w-3" />
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
};
