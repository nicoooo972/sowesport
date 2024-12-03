'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const tournaments = [
  {
    id: 1,
    name: 'World Championship Finals',
    game: 'League of Legends',
    date: '2024-08-15',
    location: [40.7128, -74.006], // New York
    prize: '$1,000,000',
  },
  {
    id: 2,
    name: 'ESL One Stockholm',
    game: 'CS:GO',
    date: '2024-09-20',
    location: [59.3293, 18.0686], // Stockholm
    prize: '$750,000',
  },
  {
    id: 3,
    name: 'The International',
    game: 'Dota 2',
    date: '2024-10-10',
    location: [35.6762, 139.6503], // Tokyo
    prize: '$2,000,000',
  },
];

export function TournamentsMap() {
  useEffect(() => {
    // Fix for Leaflet icons in Next.js
    delete (window as any).L.Icon.Default.prototype._getIconUrl;
    (window as any).L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tournaments.map((tournament) => (
        <Marker key={tournament.id} position={tournament.location as [number, number]}>
          <Popup>
            <Card className="border-0 p-2">
              <h3 className="mb-2 font-bold">{tournament.name}</h3>
              <p className="mb-1 text-sm">Game: {tournament.game}</p>
              <p className="mb-1 text-sm">Date: {tournament.date}</p>
              <p className="mb-2 text-sm">Prize Pool: {tournament.prize}</p>
              <Link href={`/events/${tournament.id}`}>
                <Button size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}