import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventDetailClient from "./EventDetailClient";

// Forcer le mode dynamique
export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string;
  };
}

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      organizer: true,
      teams: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const serializedEvent = {
    ...event,
    id: event.id.toString(),
    prize: event.prize.toString(),
    organizerId: event.organizerId?.toString(),
    teams: event.teams.map((team) => ({
      ...team,
      eventId: team.eventId.toString(),
      teamId: team.teamId.toString(),
      team: {
        ...team.team,
        id: team.team.id.toString(),
      },
    })),
    organizer: event.organizer
      ? {
          ...event.organizer,
          id: event.organizer.id.toString(),
        }
      : null,
  };

  return serializedEvent;
}

export default async function EventPage({ params }: Props) {
  const event = await getEvent(params.id);
  return <EventDetailClient event={event} />;
}
