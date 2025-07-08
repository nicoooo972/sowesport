'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Euro, 
  Calendar, 
  Clock, 
  Trophy,
  Locate,
  Filter,
  Layers,
  Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// Import dynamique pour éviter les erreurs SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Popup })), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Circle })), { ssr: false });

let useMap: () => any;
if (typeof window !== 'undefined') {
  useMap = require('react-leaflet').useMap;
}

// Interface pour les événements enrichie
interface EnhancedEventData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  game: string;
  teams_count: number;
  prize_pool?: string;
  location?: string;
  latitude: number;
  longitude: number;
  address?: string;
  venue_name?: string;
  event_date?: string;
  event_time?: string;
  status: string;
  image_url?: string;
  organizer_name?: string;
  organizer_logo?: string;
  registration_open: boolean;
  distance?: number; // Calculée côté client
}

// Interface pour les statistiques régionales
interface RegionStats {
  region: string;
  total_events: number;
  upcoming_events: number;
  ongoing_events: number;
  completed_events: number;
  avg_teams_per_event: number;
}

const getStatusBadge = (status: string, registrationOpen: boolean) => {
  if (status === 'en-cours' || status === 'live') {
    return <Badge className="bg-red-500 text-white animate-pulse">🔴 EN DIRECT</Badge>;
  }
  if (status === 'upcoming' && registrationOpen) {
    return <Badge className="bg-green-500 text-white">✅ INSCRIPTIONS OUVERTES</Badge>;
  }
  if (status === 'upcoming' && !registrationOpen) {
    return <Badge className="bg-orange-500 text-white">⏰ INSCRIPTIONS FERMÉES</Badge>;
  }
  return <Badge className="bg-gray-500 text-white">✓ TERMINÉ</Badge>;
};

const getGameIcon = (game: string) => {
  const icons: { [key: string]: string } = {
    'League of Legends': '⚔️',
    'Valorant': '🎯',
    'Counter-Strike 2': '💥',
    'Rocket League': '🚗',
    'Overwatch 2': '🎮',
    'Apex Legends': '🏆',
    'Multi-jeux': '🎪'
  };
  return icons[game] || '🎮';
};

export function EnhancedEventsMap() {
  const [events, setEvents] = useState<EnhancedEventData[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(100); // km
  const [regionStats, setRegionStats] = useState<RegionStats[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les événements depuis Supabase avec les nouvelles fonctions
  useEffect(() => {
    async function fetchEventsFromSupabase() {
      try {
        // Utiliser la vue events_map_view que nous avons créée
        const { data: eventsData, error: eventsError } = await supabase
          .from('events_map_view')
          .select('*')
          .order('event_date', { ascending: true });

        if (eventsError) {
          console.error('Erreur lors du chargement des événements:', eventsError);
          return;
        }

        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
        }

        // Charger les statistiques par région
        const { data: statsData, error: statsError } = await supabase
          .from('events_by_region')
          .select('*');

        if (!statsError && statsData) {
          setRegionStats(statsData);
        }

      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isClient) {
      fetchEventsFromSupabase();
    }
  }, [isClient]);

  // Géolocalisation et événements proches
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation([48.8566, 2.3522]); // Paris par défaut
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        // Utiliser la fonction get_nearby_events
        try {
          const { data, error } = await supabase
            .rpc('get_nearby_events', {
              user_lat: latitude,
              user_lon: longitude,
              radius_km: selectedRadius
            });

          if (!error && data) {
            // Enrichir les événements avec les distances
            setEvents(prevEvents => 
              prevEvents.map(event => {
                const nearbyEvent = data.find((ne: any) => ne.event_id === event.id);
                return nearbyEvent 
                  ? { ...event, distance: nearbyEvent.distance_km }
                  : event;
              })
            );
          }
        } catch (error) {
          console.error('Erreur lors du calcul des distances:', error);
        }
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setUserLocation([48.8566, 2.3522]); // Paris par défaut
      }
    );
  }, [selectedRadius]);

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    if (gameFilter !== 'all' && event.game !== gameFilter) return false;
    if (statusFilter !== 'all' && event.status !== statusFilter) return false;
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date à confirmer';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Composant pour la géolocalisation
  function LocationMarker() {
    const map = useMap ? useMap() : null;

    const handleCenterOnUser = () => {
      if (userLocation && map) {
        map.setView(userLocation, 12);
      }
    };

    if (!userLocation) return null;

    return (
      <>
        <Marker position={userLocation}>
          <Popup>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center">
                <Locate className="w-4 h-4 text-white" />
              </div>
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
        
        {/* Cercle de rayon */}
        <Circle
          center={userLocation}
          radius={selectedRadius * 1000} // Convertir km en mètres
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2
          }}
        />
      </>
    );
  }

  // Obtenir les données GeoJSON (pour usage futur)
  const exportGeoJSON = async () => {
    try {
      const { data, error } = await supabase.rpc('get_events_geojson');
      if (!error && data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.geojson';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur export GeoJSON:', error);
    }
  };

  if (!isClient || !userLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement de la carte interactive...</p>
          <p className="text-gray-400 text-sm mt-2">
            Détection de votre position et des événements
          </p>
        </motion.div>
      </div>
    );
  }

  const games = ['all', ...Array.from(new Set(events.map(e => e.game)))];
  const statuses = ['all', 'upcoming', 'en-cours', 'termine'];

  return (
    <div className="relative h-full w-full">
      {/* CSS Leaflet */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      {/* Filtres flottants */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-[1000] space-y-2"
      >
        <Card className="bg-slate-800/90 backdrop-blur-md border-slate-700 p-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-400" />
              <span className="text-white font-semibold text-sm">Filtres</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 min-w-[200px]">
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              >
                <option value="all">🎮 Tous les jeux</option>
                {games.slice(1).map(game => (
                  <option key={game} value={game}>
                    {getGameIcon(game)} {game}
                  </option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              >
                <option value="all">📅 Tous les statuts</option>
                <option value="upcoming">⏳ À venir</option>
                <option value="en-cours">🔴 En cours</option>
                <option value="termine">✅ Terminé</option>
              </select>
              
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              >
                <option value={25}>📍 25 km</option>
                <option value={50}>🌍 50 km</option>
                <option value={100}>🗺️ 100 km</option>
                <option value={200}>🌐 200 km</option>
              </select>
            </div>
            
            <div className="text-xs text-gray-400">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} affiché{filteredEvents.length > 1 ? 's' : ''}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contrôles à droite */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Button
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
        >
          <Layers className="w-4 h-4 mr-1" />
          Stats
        </Button>

        <Button
          size="sm"
          onClick={exportGeoJSON}
          className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
        >
          <Search className="w-4 h-4 mr-1" />
          Export
        </Button>

        {userLocation && (
          <Button
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          >
            <Locate className="w-4 h-4 mr-1" />
            Recentrer
          </Button>
        )}
      </div>

      {/* Panneau des statistiques */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-16 right-4 z-[1000] w-80"
          >
            <Card className="bg-slate-800/95 backdrop-blur-md border-slate-700 p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Statistiques par région
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {regionStats.map((stat, idx) => (
                  <div key={stat.region} className="text-sm border-b border-slate-600 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{stat.region}</span>
                      <Badge variant="secondary" className="bg-purple-600">
                        {stat.total_events}
                      </Badge>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      À venir: {stat.upcoming_events} | 
                      Moy. équipes: {Math.round(stat.avg_teams_per_event)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carte */}
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
          
          <LocationMarker />

          {/* Marqueurs des événements filtrés */}
          {filteredEvents.map((event) => (
            <Marker 
              key={event.id} 
              position={[event.latitude, event.longitude]}
            >
              <Popup maxWidth={350} className="custom-popup">
                <Card className="border-0 p-0 bg-slate-800 text-white shadow-2xl">
                  <div className="p-4">
                    {/* Header avec icône et badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getGameIcon(event.game)}</span>
                          <h3 className="font-bold text-lg">{event.title}</h3>
                        </div>
                        <p className="text-purple-300 text-sm">{event.game}</p>
                        {event.subtitle && (
                          <p className="text-gray-400 text-xs mt-1">{event.subtitle}</p>
                        )}
                      </div>
                      {getStatusBadge(event.status, event.registration_open)}
                    </div>

                    {/* Informations principales */}
                    <div className="space-y-2 mb-4">
                      {event.venue_name && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-orange-400" />
                          <span className="font-medium">{event.venue_name}</span>
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

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <span>{event.teams_count} équipes</span>
                        </div>
                        
                        {event.prize_pool && (
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-yellow-400" />
                            <span className="font-semibold text-yellow-400">{event.prize_pool}</span>
                          </div>
                        )}
                      </div>

                      {/* Distance et organisateur */}
                      <div className="flex items-center justify-between text-sm">
                        {event.distance && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Navigation className="w-4 h-4" />
                            <span>{event.distance.toFixed(1)} km</span>
                          </div>
                        )}
                        
                        {event.organizer_name && (
                          <div className="text-gray-400 text-xs">
                            par {event.organizer_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Adresse complète */}
                    {event.address && (
                      <div className="mb-4 p-2 bg-slate-700 rounded text-xs">
                        <p className="text-gray-300">{event.address}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/evenements/${event.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-500">
                          <Trophy className="w-4 h-4 mr-1" />
                          Voir détails
                        </Button>
                      </Link>
                      
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
                    </div>
                  </div>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 text-white p-6 rounded-lg"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p>Chargement des événements...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
} 