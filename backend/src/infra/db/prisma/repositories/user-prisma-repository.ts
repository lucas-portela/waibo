import {
  UserCreate,
  UserRepository,
  UserUpdate,
} from 'src/domain/user/repositories/user.repository';
import { PrismaService } from '../prisma.service';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? new UserEntity(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user ? new UserEntity(user) : null;
  }

  async create(data: UserCreate): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return new UserEntity(created);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async update(id: string, data: UserUpdate): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return new UserEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
