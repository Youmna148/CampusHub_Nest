import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('events/:eventId/book')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('student')
  create(@Param('eventId') eventId: string, @CurrentUser() user: UserDocument) {
    return this.bookingsService.create(eventId, user);
  }

  @Get('bookings/me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('student')
  findMyBookings(@CurrentUser() user: UserDocument) {
    return this.bookingsService.findMyBookings(user);
  }

  @Delete('bookings/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('student')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.bookingsService.remove(id, user);
  }
}
