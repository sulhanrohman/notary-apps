import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    return { message: 'Tenant service create logic placeholder' };
  }

  async findOne(id: string) {
    return { message: 'Tenant service findOne logic placeholder' };
  }
}
