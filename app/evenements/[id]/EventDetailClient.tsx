"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  EuroIcon,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

interface EventTeam {
  eventId: string;
  teamId: string;
  position: number | null;
  matches: number | null;
  wins: number | null;
  losses: number | null;
  points: number | null;
  trend: "up" | "down" | null;
  team: Team;
}

interface Organizer {
  id: string;
  name: string;
  logoUrl: string;
}

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
  organizer: Organizer | null;
  teams: EventTeam[];
}

interface Props {
  event: SerializedEvent;
}

export default function EventDetailClient({ event }: Props) {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-purple-900 via-purple-800 to-background h-[300px] absolute top-0 left-0 right-0" />

      {/* Header */}
      <div className="container px-24 py-8 relative">
        <Link href="/evenements" className="flex items-center text-white mb-4">
          <ArrowLeft className="mr-2" /> Retour aux événements
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
        <p className="text-gray-300">Classements détaillés</p>
      </div>

      {/* Banner Image */}
      <div className="relative h-[200px] w-full overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/50" />
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80">
          <div className="container px-24 flex justify-between items-end">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge className="bg-purple-600">{event.status}</Badge>
                <Badge variant={event.isOpen ? "success" : "destructive"}>
                  {event.isOpen ? "Open" : "Close"}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white">{event.title}</h2>
              <p className="text-purple-400">{event.game}</p>
            </div>
            <div className="flex gap-8 text-white">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-purple-400" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-purple-400" />
                {event.participants} équipes
              </div>
              <div className="flex items-center gap-2">
                <EuroIcon className="h-5 w-5 text-purple-400" />
                {event.prize} €
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-400" />
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-24">
        {/* À propos */}
        <Card className="p-6 mb-8 border-3 border-white">
          <h3 className="text-xl font-bold mb-4">À propos</h3>
          <p className="text-gray-500">{event.description}</p>
        </Card>

        {/* Format */}
        <Card className="p-6 mb-8 border-3 border-white">
          <h3 className="text-xl font-bold mb-4">Format du tournoi</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{event.format}</span>
          </div>
        </Card>

        {/* Équipes */}
        <Card className="p-6 mb-8 border-3 border-white">
          <h3 className="text-xl font-bold mb-4">Équipes participantes</h3>
          <div className="grid grid-cols-2 gap-4">
            {event.teams.map((eventTeam) => (
              <div
                key={eventTeam.teamId}
                className="flex items-center gap-2 p-3 bg-gray-900 rounded border border-white"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full">
                  <img
                    src={eventTeam.team.logoUrl}
                    alt={eventTeam.team.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span>{eventTeam.team.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-8">
          {/* Organisateur */}
          <Card className="p-6 border-3 border-white">
            <h3 className="text-xl font-bold mb-4">Organisateur</h3>
            {event.organizer && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full">
                  <img
                    src={event.organizer.logoUrl}
                    alt={event.organizer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span>{event.organizer.name}</span>
              </div>
            )}
          </Card>

          {/* Classement */}
          <Card className="col-span-2 p-6 border-3 border-white">
            <h3 className="text-xl font-bold mb-4">Classement actuel</h3>
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="text-left">Position</th>
                  <th className="text-left">Équipe</th>
                  <th className="text-center">MJ</th>
                  <th className="text-center">V</th>
                  <th className="text-center">D</th>
                  <th className="text-center">Points</th>
                  <th className="text-center">Tendance</th>
                </tr>
              </thead>
              <tbody>
                {event.teams
                  .filter((team) => team.position !== null)
                  .sort((a, b) => (a.position || 0) - (b.position || 0))
                  .map((eventTeam) => (
                    <tr
                      key={eventTeam.teamId}
                      className="border-t border-gray-800"
                    >
                      <td className="py-3">{eventTeam.position}</td>
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full">
                          <img
                            src={eventTeam.team.logoUrl}
                            alt={eventTeam.team.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        {eventTeam.team.name}
                      </td>
                      <td className="text-center py-3">{eventTeam.matches}</td>
                      <td className="text-center py-3 text-green-500">
                        {eventTeam.wins}
                      </td>
                      <td className="text-center py-3 text-red-500">
                        {eventTeam.losses}
                      </td>
                      <td className="text-center py-3">{eventTeam.points}</td>
                      <td className="text-center py-3">
                        {eventTeam.trend === "up"
                          ? "↗️"
                          : eventTeam.trend === "down"
                          ? "↘️"
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Partager */}
        <Card className="p-6 mt-8 border-3 border-white">
          <h3 className="text-xl font-bold mb-4">Partager</h3>
          <div className="flex gap-4">{/* Icônes de partage */}</div>
        </Card>
      </div>
    </div>
  );
}
