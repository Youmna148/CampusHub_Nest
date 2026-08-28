import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Booking, BookingDocument } from './schemas/booking.schema';
import { Event, EventDocument } from '../events/schemas/event.schema';
import type { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(eventId: string, user: UserDocument) {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.startDate <= new Date()) {
      throw new BadRequestException(
        'You cannot book an event that has already started',
      );
    }

    const existingBooking = await this.bookingModel.findOne({
      user: user._id,
      event: event._id,
    });

    if (existingBooking) {
      throw new BadRequestException('You have already booked this event');
    }

    const bookingsCount = await this.bookingModel.countDocuments({
      event: event._id,
    });

    if (bookingsCount >= event.capacity) {
      throw new BadRequestException('This event is full');
    }

    return this.bookingModel.create({
      user: user._id,
      event: event._id,
      price: event.price,
    });
  }
  async findMyBookings(user: UserDocument) {
    return this.bookingModel
      .find({
        user: user._id,
      })
      .populate({
        path: 'event',
        select: 'name startDate location price',
      });
  }
  async remove(id: string, user: UserDocument) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isOwner = booking.user.toString() === user._id.toString();

    if (!isOwner) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    await booking.deleteOne();
  }
}
