
import type { Event } from './event.interface.js';

export const events: Event[] = [
  {
    id: 'evt-101',
    title: 'Technology Innovation Conference',
    description: 'A conference about modern technology and innovation.',
    location: 'Main Campus',
    eventDate: '2026-12-04T09:00:00.000Z',
    category: 'technology',
    isPublished: true,
  },
  {
    id: 'evt-102',
    title: 'Web Development Workshop',
    description: 'Learn modern web development technologies.',
    location: 'Engineering Block',
    eventDate: '2026-12-10T10:00:00.000Z',
    category: 'technology',
    isPublished: true,
  },
  {
    id: 'evt-103',
    title: 'Business Entrepreneurship Day',
    description: 'Discover business ideas and entrepreneurship.',
    location: 'Business Block',
    eventDate: '2026-12-15T08:00:00.000Z',
    category: 'business',
    isPublished: true,
  },
  {
    id: 'evt-104',
    title: 'Campus Sports Competition',
    description: 'A fun sports competition for students.',
    location: 'Sports Field',
    eventDate: '2026-12-20T08:00:00.000Z',
    category: 'sports',
    isPublished: false,
  },
  {
    id: 'evt-105',
    title: 'Artificial Intelligence Seminar',
    description: 'An introduction to artificial intelligence.',
    location: 'Main Campus',
    eventDate: '2027-01-05T09:00:00.000Z',
    category: 'technology',
    isPublished: true,
  },
];
