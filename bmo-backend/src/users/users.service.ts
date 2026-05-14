import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateProfileDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true,
        avatar: true, bio: true, createdAt: true,
        _count: { select: { tasks: true, moodEntries: true } },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return (this.prisma as any).user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, name: true, email: true, avatar: true, bio: true, updatedAt: true },
    });
  }
}
