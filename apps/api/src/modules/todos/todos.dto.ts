import {
  IsNotEmpty,
  Validate,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  Matches,
} from 'class-validator';
import { DueDateValidator } from '../shared/custom-class-validators/date.validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTodoRequestDto {
  @ApiProperty({
    example: 'This is my test todo',
    description: 'Add a description to your todo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60, {
    message: 'Description must be 60 characters or fewer',
  })
  description: string;

  @ApiProperty({
    example: '2024-08-28',
    description: 'Set a due date to your todo',
  })
  @Validate(DueDateValidator)
  dueDate?: string;

  @ApiProperty({
    example: true,
    description: 'Toggle the complete status of your todo',
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class PatchTodoRequestDto extends PartialType(CreateTodoRequestDto) {}

export class FetchQueryParamsDto {
  @ApiProperty({
    example: 'sortBy=dueDate:asc',
    description: 'Sort by due date in ascending or descending order',
  })
  @IsOptional()
  @Matches(/^dueDate:(asc|desc)$/, {
    message: ({ value }) => {
      return `Invalid query param: ${value}`;
    },
  })
  sortBy?: string;

  @ApiProperty({
    example: 'completed=true',
    description: 'Filter only completed or incomplete todos',
  })
  @IsOptional()
  completed?: string;
}

export class TodoResponseDto {
  id: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string;
}
