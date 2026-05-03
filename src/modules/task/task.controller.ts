import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskActionDto } from './dto/task-action.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(UserRole.MEMBER, UserRole.ADMIN)
  create(@CurrentUser() user: any, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(user, createTaskDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.taskService.findAll(user);
  }

  @Patch(':id/action')
  @Roles(UserRole.MEMBER, UserRole.ADMIN)
  performAction(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() actionDto: TaskActionDto,
  ) {
    return this.taskService.performAction(user, id, actionDto);
  }
}
