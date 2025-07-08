import { supabase } from './supabase';

// Interface pour créer un nouvel événement
export interface CreateEventData {
  title: string;
  subtitle?: string;
  description?: string;
  game: string;
  teams_count: number;
  prize_pool?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  venue_name?: string;
  event_date: string;
  event_time?: string;
  status: 'upcoming' | 'en-cours' | 'termine';
  registration_open: boolean;
  organizer_name?: string;
  organizer_logo?: string;
  image_url?: string;
}

// Interface pour les coordonnées
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Fonction pour geocoder une adresse via Nominatim (gratuit)
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=fr&limit=1`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur geocoding:', error);
    return null;
  }
}

// Fonction pour créer un événement avec géolocalisation automatique
export async function createEventWithGeolocation(eventData: CreateEventData) {
  try {
    // Si pas de coordonnées, essayer de les obtenir automatiquement
    if (!eventData.latitude || !eventData.longitude) {
      const addressToGeocode = eventData.address || eventData.venue_name || eventData.location;
      
      if (addressToGeocode) {
        console.log('🌍 Géolocalisation automatique de:', addressToGeocode);
        const coords = await geocodeAddress(addressToGeocode);
        
        if (coords) {
          eventData.latitude = coords.latitude;
          eventData.longitude = coords.longitude;
          console.log('✅ Coordonnées trouvées:', coords);
        } else {
          console.warn('⚠️ Impossible de géolocaliser automatiquement');
        }
      }
    }

    // Générer un ID unique basé sur le titre
    const id = eventData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Insérer l'événement
    const { data, error } = await supabase
      .from('events')
      .insert({
        id,
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Événement créé avec succès:', data);
    return data;

  } catch (error) {
    console.error('❌ Erreur création événement:', error);
    throw error;
  }
}

// Fonction pour obtenir les événements proches
export async function getNearbyEvents(
  userLat: number, 
  userLon: number, 
  radiusKm: number = 50
) {
  try {
    const { data, error } = await supabase
      .rpc('get_nearby_events', {
        user_lat: userLat,
        user_lon: userLon,
        radius_km: radiusKm
      });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur récupération événements proches:', error);
    return [];
  }
}

// Fonction pour mettre à jour les coordonnées d'un événement existant
export async function updateEventCoordinates(
  eventId: string, 
  coordinates: Coordinates,
  address?: string,
  venueName?: string
) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: address,
        venue_name: venueName,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur mise à jour coordonnées:', error);
    throw error;
  }
}

// Fonction pour obtenir les statistiques des événements
export async function getEventsStatistics() {
  try {
    const { data, error } = await supabase
      .from('events_by_region')
      .select('*');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    return [];
  }
}

// Fonction pour exporter les événements en GeoJSON
export async function exportEventsAsGeoJSON() {
  try {
    const { data, error } = await supabase
      .rpc('get_events_geojson');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur export GeoJSON:', error);
    return null;
  }
}

// Quelques coordonnées utiles de villes françaises
export const FRENCH_CITIES_COORDINATES = {
  'Paris': { latitude: 48.8566, longitude: 2.3522 },
  'Lyon': { latitude: 45.7640, longitude: 4.8357 },
  'Marseille': { latitude: 43.2965, longitude: 5.3698 },
  'Toulouse': { latitude: 43.6047, longitude: 1.4442 },
  'Nice': { latitude: 43.7102, longitude: 7.2620 },
  'Nantes': { latitude: 47.2184, longitude: -1.5536 },
  'Strasbourg': { latitude: 48.5734, longitude: 7.7521 },
  'Lille': { latitude: 50.6292, longitude: 3.0573 },
  'Bordeaux': { latitude: 44.8378, longitude: -0.5792 },
  'Rennes': { latitude: 48.1173, longitude: -1.6778 },
  'Montpellier': { latitude: 43.6110, longitude: 3.8767 },
  'Grenoble': { latitude: 45.1885, longitude: 5.7245 }
};

// Fonction helper pour créer rapidement un événement de test
export async function createTestEvent(cityName: keyof typeof FRENCH_CITIES_COORDINATES) {
  const coords = FRENCH_CITIES_COORDINATES[cityName];
  
  const testEvent: CreateEventData = {
    title: `Tournoi Test ${cityName}`,
    subtitle: `Événement de démonstration à ${cityName}`,
    description: `Un tournoi organisé pour tester le système de géolocalisation`,
    game: 'League of Legends',
    teams_count: 8,
    prize_pool: '1 000€',
    location: `${cityName}, France`,
    latitude: coords.latitude,
    longitude: coords.longitude,
    address: `Centre-ville de ${cityName}`,
    venue_name: `Arena ${cityName}`,
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Dans 30 jours
    event_time: '14:00 - 18:00',
    status: 'upcoming',
    registration_open: true,
    organizer_name: 'SowEsport',
    organizer_logo: '/logo.svg'
  };

  return await createEventWithGeolocation(testEvent);
}

// Fonction pour calculer la distance entre deux points (côté client)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
} 