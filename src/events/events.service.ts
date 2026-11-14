
import { Injectable, NotFoundException } from '@nestjs/common';
import { events } from './events.data.js';
import { sessions } from './sessions.data.js';
import type { Event } from './event.interface.js';
import type { Session } from './session.interface.js';
import type { FindEventsQueryDto } from './dto/find-events-query.dto.js';

@Injectable()
export class EventsService {
  findAll(query: FindEventsQueryDto) {
    const {
      category,
      location,
      isPublished,
      sortBy = 'eventDate',
      order = 'asc',
      page = 1,
      limit = 5,
    } = query;

    // 1. Filter events
    let result = events.filter((event) => {
      const matchesCategory =
        !category || event.category.toLowerCase() === category.toLowerCase();

      const matchesLocation =
        !location || event.location.toLowerCase().includes(location.toLowerCase());

      const matchesPublished =
        isPublished === undefined || event.isPublished === isPublished;

      return matchesCategory && matchesLocation && matchesPublished;
    });

    // 2. Sort events without changing the original array
    result = [...result].sort((a, b) => {
      const comparison =
        sortBy === 'title'
          ? a.title.localeCompare(b.title)
          : new Date(a.eventDate).getTime() -
            new Date(b.eventDate).getTime();

      return order === 'desc' ? -comparison : comparison;
    });

    // 3. Calculate pagination
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    // 4. Select events for the requested page
    const items = result.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findOne(id: string): Event {
    const event = events.find((event) => event.id === id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  findUpcoming(): Event[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(
      (event) => new Date(event.eventDate) >= today,
    );
  }

  findSessions(eventId: string): Session[] {
    this.findOne(eventId);

    return sessions.filter((session) => session.eventId === eventId);
  }

  findOneSession(eventId: string, sessionId: string): Session {
    this.findOne(eventId);

    const session = sessions.find(
      (session) =>
        session.id === sessionId && session.eventId === eventId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
