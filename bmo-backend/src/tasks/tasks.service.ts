import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return (this.prisma as any).task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
  }

  async findAll(userId: string, status?: string) {
    return (this.prisma as any).task.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, taskId: string) {
    const task = await (this.prisma as any).task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    if (task.userId !== userId) throw new ForbiddenException('Acesso negado');
    return task;
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findOne(userId, taskId);
    return (this.prisma as any).task.update({
      where: { id: taskId },
      data: {
        ...dto,
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
      },
    });
  }

  async remove(userId: string, taskId: string) {
    await this.findOne(userId, taskId);
    await (this.prisma as any).task.delete({ where: { id: taskId } });
    return { message: 'Tarefa removida com sucesso' };
  }

  async getStats(userId: string) {
    const [total, pending, inProgress, done] = await Promise.all([
      (this.prisma as any).task.count({ where: { userId } }),
      (this.prisma as any).task.count({ where: { userId, status: 'PENDING' } }),
      (this.prisma as any).task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      (this.prisma as any).task.count({ where: { userId, status: 'DONE' } }),
    ]);
    return { total, pending, inProgress, done };
  }

  async generateDaily(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await (this.prisma as any).task.findMany({
      where: {
        userId,
        createdAt: { gte: today, lt: tomorrow },
        description: 'daily',
      },
    });

    if (existing.length > 0) {
      return existing;
    }

    const allDaily = await (this.prisma as any).dailyTask.findMany();
    const shuffled = allDaily.sort(() => Math.random() - 0.5).slice(0, 6);

    const created = await Promise.all(
      shuffled.map((t: any) =>
        (this.prisma as any).task.create({
          data: {
            userId,
            title: t.title,
            description: 'daily',
            dueDate: tomorrow,
          },
        }),
      ),
    );

    return created;
  }
}