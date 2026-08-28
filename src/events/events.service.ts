import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryFilter } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import type { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  async findAll(queryDto: QueryEventsDto) {
    const { category, search, sort, fields, page = 1, limit = 5 } = queryDto;

    const filter: QueryFilter<Event> = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    let query = this.eventModel.find(filter).skip(skip).limit(limit);

    if (sort) {
      query = query.sort(sort);
    }
    if (fields) {
      query = query.select(fields.split(',').join(' '));
    }
    return query;
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async create(eventData: CreateEventDto, user: UserDocument) {
    return this.eventModel.create({
      ...eventData,

      // DTO gives us a string, MongoDB schema expects a Date
      startDate: new Date(eventData.startDate),

      organizer: user._id,
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: UserDocument) {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isOwner = event.organizer.toString() === user._id.toString();

    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only modify your own events');
    }

    Object.assign(event, updateEventDto);

    return event.save();
  }
  async remove(id: string, user: UserDocument) {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isOwner = event.organizer.toString() === user._id.toString();

    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await event.deleteOne();

    return;
  }
}
