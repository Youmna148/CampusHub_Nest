import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Event',
    required: true,
  })
  event!: Types.ObjectId;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    enum: ['confirmed'],
    default: 'confirmed',
  })
  status!: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ user: 1, event: 1 }, { unique: true });
