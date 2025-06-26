'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Props pour le composant Map
interface MapProps {
  children: React.ReactNode;
  center: [number, number];
  zoom: number;
  style: React.CSSProperties;
  className?: string;
  zoomControl?: boolean;
}

// Composant wrapper pour la carte
export default function DynamicMapComponents({ children, ...props }: MapProps) {
  return (
    <MapContainer {...props}>
      {children}
    </MapContainer>
  );
}

// Export des composants pour utilisation directe
export { MapContainer, TileLayer, Marker, Popup, useMap }; 