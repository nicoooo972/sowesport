"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  SearchIcon,
  MapPinIcon,
  UsersIcon,
  EuroIcon,
} from "lucide-react";

interface SerializedEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  game: string;
  imageUrl: string;
  status: "en_ligne" | "close";
  location: string;
  participants: number;
  prize: string;
  isOpen: boolean;
  format: string;
  organizerId: string | null;
}

interface EventsListProps {
  currentEvents: SerializedEvent[];
  upcomingEvents: SerializedEvent[];
}

export default function EventsList({
  currentEvents,
  upcomingEvents,
}: EventsListProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-14">
      <div className="bg-gradient-to-b from-purple-900 via-purple-800 to-background h-[300px] absolute top-0 left-0 right-0" />
      <div className="container px-24 py-16 relative">
        <div className="mb-16 pl-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Événements Esport
          </h1>
          <p className="text-gray-300 text-lg">
            Découvrez les événements esport en France !
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="bg-[#42434C] rounded-lg p-4 mb-16 border-2 border-white">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un jeu..."
                className="w-full pl-10 pr-4 py-2 bg-[#42434C] rounded-md border border-white"
              />
            </div>
            <Button variant="outline" className="border-white bg-[#42434C]">
              Tous les événements
            </Button>
            <Button variant="outline" className="border-white bg-[#42434C]">
              Type de jeux
            </Button>
            <Button variant="outline" className="border-white bg-[#42434C]">
              Lieu
            </Button>
          </div>
          <div className="flex gap-2">
            <p className="text-sm text-muted-foreground">
              Vos dernières recherches :
            </p>
            {["League of Legends", "CS:GO", "Valorant", "Dota 2"].map(
              (game) => (
                <Badge
                  key={game}
                  variant="secondary"
                  className="border border-white bg-[#42434C]"
                >
                  {game}
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Événements en cours */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Événements en cours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => (
              <Card key={event.id} className="relative overflow-hidden">
                <div
                  className="aspect-video w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-purple-600">{event.status}</Badge>
                  <Badge variant={event.isOpen ? "success" : "destructive"}>
                    {event.isOpen ? "Open" : "Close"}
                  </Badge>
                </div>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <span className="text-purple-600 text-xs">{event.game}</span>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {event.participants} équipes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EuroIcon className="h-4 w-4" />
                      <span className="text-sm">{event.prize} €</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push(`/evenements/${event.id}`)}
                  >
                    En savoir plus !
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Événements à venir */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Événements à venir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="relative overflow-hidden">
                <div
                  className="aspect-video w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-purple-600">{event.status}</Badge>
                  <Badge variant={event.isOpen ? "success" : "destructive"}>
                    {event.isOpen ? "Open" : "Close"}
                  </Badge>
                </div>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <span className="text-purple-600 text-xs">{event.game}</span>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {event.participants} équipes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EuroIcon className="h-4 w-4" />
                      <span className="text-sm">{event.prize} €</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push(`/evenements/${event.id}`)}
                  >
                    En savoir plus !
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
