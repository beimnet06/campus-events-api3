import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  isPublished: boolean;
}