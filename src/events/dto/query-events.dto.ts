import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryEventsDto {
  @IsOptional()
  @IsIn(['technology', 'career', 'sports', 'workshop', 'competition', 'other'])
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn([
    'price',
    '-price',
    'startDate',
    '-startDate',
    'ratingsAverage',
    '-ratingsAverage',
  ])
  sort?: string;

  @IsOptional()
  @Type(() => Number) //Convert the incoming "2" into the number 2
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  fields?: string;
}
