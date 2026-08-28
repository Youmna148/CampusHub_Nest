import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),

    AuthModule,
  ],

  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
