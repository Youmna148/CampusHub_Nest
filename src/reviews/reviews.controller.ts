import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import type { UserDocument } from '../users/schemas/user.schema';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('events/:eventId/reviews')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('student')
  create(
    @Param('eventId') eventId: string,
    @Body() reviewData: CreateReviewDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.reviewsService.create(eventId, reviewData, user);
  }
  @Get('events/:eventId/reviews')
  findForEvent(@Param('eventId') eventId: string) {
    return this.reviewsService.findForEvent(eventId);
  }
  @Patch('reviews/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('student')
  update(
    @Param('id') id: string,
    @Body() reviewData: UpdateReviewDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.reviewsService.update(id, reviewData, user);
  }
  @Delete('reviews/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('student')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.reviewsService.remove(id, user);
  }
}
