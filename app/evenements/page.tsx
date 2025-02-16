import { prisma } from "@/lib/prisma";
import EventsList from "./EventsList";

export default async function EventsPage() {
  const now = new Date();

  const [currentEvents, upcomingEvents] = await Promise.all([
    prisma.event.findMany({
      where: {
        date: {
          lte: now,
        },
      },
      orderBy: {
        date: "desc",
      },
    }),
    prisma.event.findMany({
      where: {
        date: {
          gt: now,
        },
      },
      orderBy: {
        date: "asc",
      },
    }),
  ]);

  // Convertir les BigInt en string
  const serializedCurrentEvents = currentEvents.map((event) => ({
    ...event,
    id: event.id.toString(),
    prize: event.prize.toString(),
    organizerId: event.organizerId?.toString(),
  }));

  const serializedUpcomingEvents = upcomingEvents.map((event) => ({
    ...event,
    id: event.id.toString(),
    prize: event.prize.toString(),
    organizerId: event.organizerId?.toString(),
  }));

  return (
    <EventsList
      currentEvents={serializedCurrentEvents}
      upcomingEvents={serializedUpcomingEvents}
    />
  );
}
