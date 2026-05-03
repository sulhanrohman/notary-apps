import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, type: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });
  }

  async findAll(user: any) {
    return this.prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(user: any, id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
