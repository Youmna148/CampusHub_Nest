import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

import { Review, ReviewSchema } from './schemas/review.schema';

import { Event, EventSchema } from '../events/schemas/event.schema';

import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: ReviewSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: Booking.name,
        schema: BookingSchema,
      },
    ]),
    AuthModule,
  ],

  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
