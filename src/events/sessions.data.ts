
import type { Session } from './session.interface.js';

export const sessions: Session[] = [
  {
    id: 'ses-201',
    eventId: 'evt-101',
    title: 'Introduction to Artificial Intelligence',
    startsAt: '2026-12-04T09:00:00.000Z',
    endsAt: '2026-12-04T10:00:00.000Z',
    room: 'Room 101',
  },
  {
    id: 'ses-202',
    eventId: 'evt-101',
    title: 'Future of Technology',
    startsAt: '2026-12-04T10:30:00.000Z',
    endsAt: '2026-12-04T11:30:00.000Z',
    room: 'Room 102',
  },
  {
    id: 'ses-203',
    eventId: 'evt-102',
    title: 'HTML and CSS Fundamentals',
    startsAt: '2026-12-10T10:00:00.000Z',
    endsAt: '2026-12-10T11:00:00.000Z',
    room: 'Lab 1',
  },
  {
    id: 'ses-204',
    eventId: 'evt-102',
    title: 'Building Your First Website',
    startsAt: '2026-12-10T11:30:00.000Z',
    endsAt: '2026-12-10T12:30:00.000Z',
    room: 'Lab 2',
  },
];
