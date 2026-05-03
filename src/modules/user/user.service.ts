import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return { message: 'User service create logic placeholder' };
  }

  async findOne(id: string) {
    return { message: 'User service findOne logic placeholder' };
  }
}
