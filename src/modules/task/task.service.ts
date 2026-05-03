import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskActionDto } from './dto/task-action.dto';
import { TaskStatus, TaskAction, UserRole, User } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(user: any, createTaskDto: CreateTaskDto) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          assignedToId: createTaskDto.assignedToId,
          createdById: user.id,
          tenantId: user.tenantId,
          status: TaskStatus.DRAFT,
        },
      });

      await tx.taskLog.create({
        data: {
          taskId: task.id,
          action: TaskAction.SUBMIT,
          performedBy: user.id,
          comment: 'Task created as Draft',
        },
      });

      // Notify assignee
      await this.notificationService.create(
        createTaskDto.assignedToId,
        'TASK_ASSIGNED',
        `You have been assigned a new task: ${task.title}`
      );

      return task;
    });
  }

  async findAll(user: any) {
    return this.prisma.task.findMany({
      where: {
        tenantId: user.tenantId,
      },
      include: {
        assignedTo: { select: { name: true, email: true } },
        createdBy: { select: { name: true, email: true } },
      },
    });
  }

  async performAction(user: any, taskId: string, actionDto: TaskActionDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { createdBy: true, assignedTo: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.tenantId !== user.tenantId) {
      throw new ForbiddenException('Access denied to this task');
    }

    const { action, comment } = actionDto;
    let nextStatus: TaskStatus;

    // Transition Logic
    switch (action) {
      case TaskAction.SUBMIT:
        if (task.status !== TaskStatus.DRAFT) {
          throw new BadRequestException('Can only submit tasks in DRAFT status');
        }
        if (user.role !== UserRole.MEMBER && user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only Members or Admins can submit tasks');
        }
        nextStatus = TaskStatus.SUBMITTED;
        break;

      case TaskAction.APPROVE:
        if (task.status !== TaskStatus.SUBMITTED) {
          throw new BadRequestException('Can only approve tasks in SUBMITTED status');
        }
        if (user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only Admins can approve tasks');
        }
        nextStatus = TaskStatus.APPROVED;
        break;

      case TaskAction.REJECT:
        if (task.status !== TaskStatus.SUBMITTED) {
          throw new BadRequestException('Can only reject tasks in SUBMITTED status');
        }
        if (user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only Admins can reject tasks');
        }
        nextStatus = TaskStatus.REJECTED;
        break;

      case TaskAction.RETURN:
        if (task.status !== TaskStatus.SUBMITTED) {
          throw new BadRequestException('Can only return tasks in SUBMITTED status');
        }
        if (user.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Only Admins can return tasks');
        }
        nextStatus = TaskStatus.RETURNED;
        break;

      default:
        throw new BadRequestException('Invalid action');
    }

    const updatedTask = await this.prisma.$transaction(async (tx) => {
      const ut = await tx.task.update({
        where: { id: taskId },
        data: { status: nextStatus },
      });

      await tx.taskLog.create({
        data: {
          taskId: ut.id,
          action,
          performedBy: user.id,
          comment: comment || `Action ${action} performed`,
        },
      });

      return ut;
    });

    // Send notifications after transaction
    const recipients = new Set([task.createdById, task.assignedToId]);
    for (const recipientId of recipients) {
      if (recipientId !== user.id) {
        await this.notificationService.create(
          recipientId,
          `TASK_${action}`,
          `Task "${task.title}" has been ${nextStatus.toLowerCase()}.`
        );
      }
    }

    return updatedTask;
  }
}
