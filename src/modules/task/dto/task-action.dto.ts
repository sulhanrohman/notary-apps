import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskAction } from '@prisma/client';

export class TaskActionDto {
  @IsEnum(TaskAction)
  action: TaskAction;

  @IsString()
  @IsOptional()
  comment?: string;
}
