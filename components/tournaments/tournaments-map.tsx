'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MapPin, Navigation, Users, Euro, Calendar, Clock, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Import dynamique pour éviter les erreurs SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Popup })), { ssr: false });

// useMap doit être importé différemment car c'est un hook
let useMap: () => any;
if (typeof window !== 'undefined') {
  useMap = require('react-leaflet').useMap;
}

// Interface pour les événements
interface EventData {
  id: string;
  title: string;
  game: string;
  subtitle?: string;
  description?: string;
  teams_count: number;
  prize_pool?: string;
  location?: string;
  full_address?: string;
  city?: string;
  venue_name?: string;
  event_date?: string;
  event_time?: string;
  status: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  registration_open: boolean;
}

// Événements mock avec coordonnées réelles
const mockEvents: EventData[] = [
  {
    id: '1',
    title: 'LFL Spring Split Finals',
    game: 'League of Legends',
    subtitle: 'Finale du championnat français',
    teams_count: 8,
    prize_pool: '50 000 €',
    location: 'Paris',
    full_address: 'Accor Arena, 8 Boulevard de Bercy, 75012 Paris',
    city: 'Paris',
    venue_name: 'Accor Arena',
    event_date: '2024-02-25',
    event_time: '18:00',
    status: 'upcoming',
    registration_open: false,
    latitude: 48.8399,
    longitude: 2.3781,
  },
  {
    id: '2',
    title: 'Valorant Champions Tour',
    game: 'Valorant',
    subtitle: 'Qualification européenne',
    teams_count: 16,
    prize_pool: '75 000 €',
    location: 'Lyon',
    full_address: 'Palais des Sports de Gerland, 350 Avenue Jean Jaurès, 69007 Lyon',
    city: 'Lyon',
    venue_name: 'Palais des Sports',
    event_date: '2024-03-10',
    event_time: '14:00',
    status: 'upcoming',
    registration_open: true,
    latitude: 45.7276,
    longitude: 4.8320,
  },
  {
    id: '3',
    title: 'CS2 Major Qualifier',
    game: 'Counter-Strike 2',
    subtitle: 'Qualification pour le Major',
    teams_count: 24,
    prize_pool: '100 000 €',
    location: 'Marseille',
    full_address: 'Palais des Sports de Marseille, 81 Avenue de Hambourg, 13008 Marseille',
    city: 'Marseille',
    venue_name: 'Palais des Sports',
    event_date: '2024-03-20',
    event_time: '16:00',
    status: 'upcoming',
    registration_open: true,
    latitude: 43.2695,
    longitude: 5.3927,
  },
];

const getStatusBadge = (status: string, registrationOpen: boolean) => {
  if (status === 'live') {
    return <Badge className="bg-red-500 text-white animate-pulse">EN DIRECT</Badge>;
  }
  if (status === 'upcoming' && registrationOpen) {
    return <Badge className="bg-green-500 text-white">INSCRIPTIONS OUVERTES</Badge>;
  }
  if (status === 'upcoming' && !registrationOpen) {
    return <Badge className="bg-orange-500 text-white">INSCRIPTIONS FERMÉES</Badge>;
  }
  return <Badge className="bg-gray-500 text-white">TERMINÉ</Badge>;
};

export function TournamentsMap() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les événements (d'abord mock, puis Supabase si disponible)
  useEffect(() => {
    async function fetchEvents() {
      try {
        // Essayer de charger depuis Supabase d'abord
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (!error && data && data.length > 0) {
          // Filtrer seulement ceux qui ont des coordonnées
          const eventsWithCoords = data.filter(event => 
            event.latitude && event.longitude
          );
          setEvents(eventsWithCoords);
        } else {
          // Fallback sur les données mock
          setEvents(mockEvents);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        // Fallback sur les données mock
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          // Position par défaut sur Paris
          setUserLocation([48.8566, 2.3522]);
        }
      );
    } else {
      // Position par défaut sur Paris
      setUserLocation([48.8566, 2.3522]);
    }
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date à confirmer';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Composant pour géolocalisation (doit être dans le MapContainer)
  function LocationMarker() {
    const map = useMap ? useMap() : null;

    useEffect(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setUserLocation(newPos);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }, []);

    const handleCenterOnUser = () => {
      if (userLocation) {
        map.setView(userLocation, 12);
      }
    };

    if (!userLocation) return null;

    return (
      <Marker position={userLocation}>
        <Popup>
          <div className="text-center">
            <MapPin className="w-4 h-4 mx-auto mb-2 text-blue-500" />
            <p className="font-semibold">Vous êtes ici</p>
            <Button 
              size="sm" 
              onClick={handleCenterOnUser}
              className="mt-2 bg-blue-500 hover:bg-blue-600"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Centrer
            </Button>
          </div>
        </Popup>
      </Marker>
    );
  }

  if (!isClient || !userLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Import CSS Leaflet dynamiquement */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      <div className="h-full w-full">
        <MapContainer
          center={userLocation}
          zoom={userLocation[0] === 48.8566 ? 6 : 10}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          className="rounded-lg"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marqueur de géolocalisation */}
          <LocationMarker />

          {/* Marqueurs des événements */}
          {events.map((event) => (
            event.latitude && event.longitude && (
              <Marker 
                key={event.id} 
                position={[event.latitude, event.longitude]}
              >
                <Popup maxWidth={320}>
                  <Card className="border-0 p-0 bg-slate-800 text-white">
                    <div className="p-4">
                      {/* Header avec badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                          <p className="text-purple-300 text-sm">{event.game}</p>
                        </div>
                        {getStatusBadge(event.status, event.registration_open)}
                      </div>

                      {/* Informations principales */}
                      <div className="space-y-2 mb-4">
                        {event.venue_name && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span>{event.venue_name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>{formatDate(event.event_date)}</span>
                          {event.event_time && (
                            <>
                              <Clock className="w-4 h-4 text-blue-400 ml-2" />
                              <span>{event.event_time}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-green-400" />
                          <span>{event.teams_count} équipes</span>
                        </div>

                        {event.prize_pool && (
                          <div className="flex items-center gap-2 text-sm">
                            <Euro className="w-4 h-4 text-yellow-400" />
                            <span>{event.prize_pool}</span>
                          </div>
                        )}

                        {/* Distance si géolocalisation disponible */}
                        {userLocation && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Navigation className="w-4 h-4" />
                            <span>
                              À {calculateDistance(
                                userLocation[0], 
                                userLocation[1], 
                                event.latitude!, 
                                event.longitude!
                              ).toFixed(1)} km
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Adresse */}
                      {(event.full_address || event.city) && (
                        <div className="mb-4 p-2 bg-slate-700 rounded text-xs">
                          <p>{event.full_address || event.city}</p>
                        </div>
                      )}

                      {/* Description */}
                      {event.subtitle && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {event.subtitle}
                        </p>
                      )}

                      {/* Boutons d'action */}
                      <div className="flex gap-2">
                        <Link href={`/evenements/${event.id}`} className="flex-1">
                          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-500">
                            <Trophy className="w-4 h-4 mr-1" />
                            Voir détails
                          </Button>
                        </Link>
                        
                        {event.latitude && event.longitude && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
                              window.open(url, '_blank');
                            }}
                            className="border-slate-600 hover:bg-slate-700"
                          >
                            <Navigation className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Contrôles flottants - z-index élevé mais pas plus que la navbar */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        {userLocation && (
          <Button
            size="sm"
            onClick={() => {
              // Recentrer sur la position utilisateur - implémentation simplifiée
              window.location.reload();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Ma position
          </Button>
        )}
        
        <div className="bg-slate-800 text-white p-2 rounded shadow-lg text-xs max-w-[150px]">
          <p className="font-semibold mb-1">Légende</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Inscriptions ouvertes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>En direct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Terminé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <div className="bg-slate-800 text-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p>Chargement des événements...</p>
          </div>
        </div>
      )}
    </div>
  );
}