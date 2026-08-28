import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;
@Schema({
  timestamps: true,
})
export class Event {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
  })
  description!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    required: true,
    min: 0,
  })
  duration!: number;

  @Prop({
    required: true,
  })
  category!: string;

  @Prop({
    required: true,
  })
  location!: string;

  @Prop({
    required: true,
  })
  startDate!: Date;

  @Prop({
    required: true,
    min: 1,
  })
  capacity!: number;
  @Prop({
    default: 0,
    min: 0,
    max: 5,
  })
  ratingsAverage!: number;

  @Prop({
    default: 0,
    min: 0,
  })
  ratingsQuantity!: number;
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  organizer!: Types.ObjectId;
}
export const EventSchema = SchemaFactory.createForClass(Event);
