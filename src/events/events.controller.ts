import { ApiSecurity } from '@nestjs/swagger';
import { TimingInterceptor } from '../common/timing/timing.interceptor.js';
import { UseInterceptors } from '@nestjs/common';
import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service.js';
import type { FindEventsQueryDto } from './dto/find-events-query.dto.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { ApiKeyGuard } from '../common/api-key/api-key.guard.js';

@Controller('events')
@UseInterceptors(TimingInterceptor)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  // POST /api/events - Create a new event
@Post()
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
create(@Body() createEventDto: CreateEventDto) {
  return this.eventsService.create(createEventDto);
}

  // GET /api/events
  // Supports filtering, sorting and pagination
  @Get()
  findAll(@Query() query: FindEventsQueryDto) {
    console.log('Received query:', query);
    return this.eventsService.findAll(query);
  }

  // GET /api/events/upcoming
  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  // GET /api/events/:id/sessions
  @Get(':id/sessions')
  findSessions(@Param('id') id: string) {
    return this.eventsService.findSessions(id);
  }

  // GET /api/events/:id/sessions/:sessionId
  @Get(':id/sessions/:sessionId')
  findOneSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.eventsService.findOneSession(id, sessionId);
  }

  // GET /api/events/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
