"use client";

import { useState, useEffect } from "react";
import { Search, Menu, MapPin, Calendar, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Import dynamique de la carte pour éviter les problèmes SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Types pour les événements sur la carte
interface MapEvent {
  id: string;
  title: string;
  game: string;
  location: string;
  date: string;
  teams: number;
  lat: number;
  lng: number;
  status: "online" | "upcoming" | "finished";
}

// Données mock pour les événements sur la carte
const mapEvents: MapEvent[] = [
  {
    id: "1",
    title: "LFL Spring Split",
    game: "League of Legends",
    location: "Paris",
    date: "20 Fév 2025",
    teams: 16,
    lat: 48.8566,
    lng: 2.3522,
    status: "online"
  },
  {
    id: "2",
    title: "Rocket League World Cup",
    game: "Rocket League", 
    location: "Lyon",
    date: "25 Février 2025",
    teams: 12,
    lat: 45.7640,
    lng: 4.8357,
    status: "upcoming"
  },
  {
    id: "3",
    title: "Valorant Champions Tour",
    game: "Valorant",
    location: "Bordeaux", 
    date: "13 Février 2025",
    teams: 20,
    lat: 44.8378,
    lng: -0.5792,
    status: "online"
  },
  {
    id: "4",
    title: "CS:GO Major Championship",
    game: "CS:GO",
    location: "Marseille",
    date: "5 Mars 2025", 
    teams: 24,
    lat: 43.2965,
    lng: 5.3698,
    status: "upcoming"
  },
  {
    id: "5",
    title: "Overwatch League Finals",
    game: "Overwatch 2",
    location: "Nice",
    date: "1 Mars 2025",
    teams: 8,
    lat: 43.7102,
    lng: 7.2620,
    status: "upcoming"
  }
];

// Composant pour la carte (doit être chargé côté client)
function InteractiveMap() {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  
  useEffect(() => {
    // Import des styles CSS de Leaflet côté client
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Charger Leaflet de manière asynchrone
    import('leaflet').then(() => {
      setLeafletLoaded(true);
    }).catch(console.error);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Utiliser les icônes par défaut de Leaflet avec couleurs
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'online': return '🟣'; // violet
      case 'upcoming': return '🔵'; // bleu
      case 'finished': return '⚫'; // gris
      default: return '📍';
    }
  };

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[48.8566, 2.3522]} // Paris
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {mapEvents.map((event) => {
        return (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
          >
            <Popup>
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0 space-y-2">
                                  <div>
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    {getMarkerColor(event.status)} {event.title}
                  </h3>
                  <p className="text-purple-600 text-xs font-medium">{event.game}</p>
                </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{event.teams} équipes</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={event.status === "online" ? "default" : "secondary"}
                    className={`text-xs ${
                      event.status === "online" 
                        ? "bg-purple-600" 
                        : event.status === "upcoming"
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {event.status === "online" ? "En cours" : 
                     event.status === "upcoming" ? "À venir" : "Terminé"}
                  </Badge>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default function CartePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);

  const filteredEvents = mapEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Carte Esport
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Découvrez les événements esport proche de vous
          </p>
        </div>
      </div>

      {/* Conteneur principal avec sidebar et carte */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl" style={{ height: "600px" }}>
          
          {/* Sidebar toggle button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 left-4 z-[1000] bg-white shadow-lg hover:bg-gray-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Barre de recherche */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white shadow-lg border-gray-200"
              />
            </div>
          </div>

          {/* Sidebar des événements */}
          <div className={`absolute top-0 left-0 h-full bg-white z-[999] transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-80 overflow-y-auto`}>
            <div className="p-4 pt-16">
              <h3 className="font-bold text-lg mb-4">Événements trouvés</h3>
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <Card 
                    key={event.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-bold text-sm">{event.title}</h4>
                          <p className="text-purple-600 text-xs font-medium">{event.game}</p>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.teams} équipes</span>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={event.status === "online" ? "default" : "secondary"}
                          className={`text-xs ${
                            event.status === "online" 
                              ? "bg-purple-600" 
                              : event.status === "upcoming"
                              ? "bg-cyan-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {event.status === "online" ? "En cours" : 
                           event.status === "upcoming" ? "À venir" : "Terminé"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Carte interactive */}
          <div className="w-full h-full">
            <InteractiveMap />
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 flex justify-center">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Légende</h3>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <span className="text-white">En cours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-cyan-600 rounded-full"></div>
                  <span className="text-white">À venir</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  <span className="text-white">Terminé</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 