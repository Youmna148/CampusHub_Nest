import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Query } from '@nestjs/common';
import { QueryEventsDto } from './dto/query-events.dto';
import { EventsService } from './events.service';
import { Event } from './schemas/event.schema';
import { UseGuards } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query() query: QueryEventsDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Post()
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.eventsService.create(createEventDto, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.eventsService.update(id, updateEventDto, user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.eventsService.remove(id, user);
  }
}
