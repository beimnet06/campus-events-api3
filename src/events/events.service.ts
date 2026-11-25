
import { Injectable, NotFoundException } from '@nestjs/common';

import { events } from './events.data.js';
import { sessions } from './sessions.data.js';

import type { Event } from './event.interface.js';
import type { Session } from './session.interface.js';
import type { FindEventsQueryDto } from './dto/find-events-query.dto.js';
import type { CreateEventDto } from './dto/create-event.dto.js';
import type { UpdateEventDto } from './dto/update-event.dto.js';
import type { UpdateSessionDto } from './dto/update-session.dto.js';

import { Role, AuthenticatedUser } from '../auth/auth.model.js';

@Injectable()
export class EventsService {
  // Create a new event
  create(
    createEventDto: CreateEventDto,
    organizerId: string,
  ): Event {
    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      ...createEventDto,
      organizerId,
    };

    events.push(newEvent);

    return newEvent;
  }

  // Update an existing event
  updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    user: AuthenticatedUser,
  ): Event {
    const event = this.findOne(id);

    if (
      user.role === Role.ORGANIZER &&
      event.organizerId !== user.id
    ) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(event, updateEventDto);

    return event;
  }

  // Update a session
  updateSession(
    eventId: string,
    sessionId: string,
    updateSessionDto: UpdateSessionDto,
    user: AuthenticatedUser,
  ): Session {
    const event = this.findOne(eventId);

    if (
      user.role === Role.ORGANIZER &&
      event.organizerId !== user.id
    ) {
      throw new NotFoundException('Event not found');
    }

    const session = this.findOneSession(eventId, sessionId);

    Object.assign(session, updateSessionDto);

    return session;
  }

  // Get all published events with filtering, sorting and pagination
  findAll(query: FindEventsQueryDto) {
    const {
      category,
      location,
      sortBy = 'eventDate',
      order = 'asc',
      page = 1,
      limit = 5,
    } = query;

    let result = events.filter((event) => {
      const matchesCategory =
        !category ||
        event.category.toLowerCase() === category.toLowerCase();

      const matchesLocation =
        !location ||
        event.location.toLowerCase().includes(location.toLowerCase());

      const matchesPublished = event.isPublished === true;

      return matchesCategory && matchesLocation && matchesPublished;
    });

    result = [...result].sort((a, b) => {
      const comparison =
        sortBy === 'title'
          ? a.title.localeCompare(b.title)
          : new Date(a.eventDate).getTime() -
            new Date(b.eventDate).getTime();

      return order === 'desc' ? -comparison : comparison;
    });

    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = result.slice(startIndex, startIndex + limit);

    return { items, total, page, limit, totalPages };
  }

  // Get one event by ID
  findOne(id: string): Event {
    const event = events.find((event) => event.id === id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  // Get one published event by ID
  findPublishedOne(id: string): Event {
    const event = this.findOne(id);

    if (!event.isPublished) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  // Get upcoming published events
  findUpcoming(): Event[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(
      (event) =>
        event.isPublished === true &&
        new Date(event.eventDate) >= today,
    );
  }

  // Get all sessions for an event
  findSessions(eventId: string): Session[] {
    this.findOne(eventId);

    return sessions.filter((session) => session.eventId === eventId);
  }

  // Get one session
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
