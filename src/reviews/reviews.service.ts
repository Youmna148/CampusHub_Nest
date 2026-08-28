import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Review, ReviewDocument } from './schemas/review.schema';

import { Event, EventDocument } from '../events/schemas/event.schema';

import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';

import type { UserDocument } from '../users/schemas/user.schema';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,

    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,

    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}
  private async recalculateRatings(eventId: Types.ObjectId) {
    const stats = await this.reviewModel.aggregate<{
      average: number;
      quantity: number;
    }>([
      {
        $match: {
          event: eventId,
        },
      },
      {
        $group: {
          _id: '$event',
          average: {
            $avg: '$rating',
          },
          quantity: {
            $sum: 1,
          },
        },
      },
    ]);

    if (stats.length === 0) {
      await this.eventModel.findByIdAndUpdate(eventId, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });

      return;
    }

    const average = Math.round(stats[0].average * 10) / 10;

    await this.eventModel.findByIdAndUpdate(eventId, {
      ratingsAverage: average,
      ratingsQuantity: stats[0].quantity,
    });
  }
  async create(
    eventId: string,
    reviewData: CreateReviewDto,
    user: UserDocument,
  ) {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const booking = await this.bookingModel.findOne({
      user: user._id,
      event: event._id,
    });

    if (!booking) {
      throw new ForbiddenException(
        'You can only review events you have booked',
      );
    }

    if (event.startDate > new Date()) {
      throw new BadRequestException(
        'You cannot review an event before it starts',
      );
    }

    const duplicate = await this.reviewModel.findOne({
      user: user._id,
      event: event._id,
      rating: reviewData.rating,
      review: reviewData.review,
    });

    if (duplicate) {
      throw new BadRequestException(
        'You have already submitted this exact review',
      );
    }

    const review = await this.reviewModel.create({
      ...reviewData,
      user: user._id,
      event: event._id,
    });

    await this.recalculateRatings(event._id);

    return review;
  }
  async findForEvent(eventId: string) {
    return this.reviewModel
      .find({
        event: eventId,
      })
      .populate({
        path: 'user',
        select: 'name',
      });
  }
  async update(id: string, reviewData: UpdateReviewDto, user: UserDocument) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isOwner = review.user.toString() === user._id.toString();

    if (!isOwner) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const newRating = reviewData.rating ?? review.rating;

    const newText = reviewData.review ?? review.review;

    const duplicate = await this.reviewModel.findOne({
      _id: {
        $ne: review._id,
      },
      user: user._id,
      event: review.event,
      rating: newRating,
      review: newText,
    });

    if (duplicate) {
      throw new BadRequestException(
        'You have already submitted this exact review',
      );
    }

    Object.assign(review, reviewData);

    const updatedReview = await review.save();

    await this.recalculateRatings(review.event);

    return updatedReview;
  }
  async remove(id: string, user: UserDocument) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isOwner = review.user.toString() === user._id.toString();

    if (!isOwner) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const eventId = review.event;

    await review.deleteOne();

    await this.recalculateRatings(eventId);
  }
}
