
import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { EventsService } from './events.service.js';
import { FindEventsQueryDto } from './dto/find-events-query.dto.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { UpdateSessionDto } from './dto/update-session.dto.js';

import { TimingInterceptor } from '../common/timing/timing.interceptor.js';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role, AuthenticatedUser } from '../auth/auth.model.js';

@Controller('events')
@UseInterceptors(TimingInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Create an event: ADMIN and ORGANIZER only
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  // Update an event: ADMIN and ORGANIZER only
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.eventsService.updateEvent(
      id,
      updateEventDto,
      req.user,
    );
  }

  // Update a session: ADMIN and ORGANIZER only
  @Patch(':id/sessions/:sessionId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  updateSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.eventsService.updateSession(
      id,
      sessionId,
      updateSessionDto,
      req.user,
    );
  }

  // Get all events
  @Get()
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  // Get upcoming events
  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  // Get all sessions for an event
  @Get(':id/sessions')
  findSessions(@Param('id') id: string) {
    return this.eventsService.findSessions(id);
  }

  // Get one session
  @Get(':id/sessions/:sessionId')
  findOneSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.eventsService.findOneSession(id, sessionId);
  }

 // Get one published event
@Get(':id')
findOne(@Param('id') id: string) {
  return this.eventsService.findPublishedOne(id);
}}