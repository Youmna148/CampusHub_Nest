import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
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
    min: 1,
    max: 5,
  })
  rating!: number;

  @Prop({
    required: true,
    trim: true,
  })
  review!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index(
  {
    user: 1,
    event: 1,
    rating: 1,
    review: 1,
  },
  {
    unique: true,
  },
);
