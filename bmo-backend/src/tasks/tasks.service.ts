import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    this.logger.log(`[create] userId=${userId} | dto=${JSON.stringify(dto)}`);
    try {
      const result = await (this.prisma as any).task.create({
        data: {
          userId,
          title: dto.title,
          description: dto.description,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        },
      });
      this.logger.log(`[create] OK | taskId=${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`[create] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(userId: string, status?: string) {
    this.logger.log(`[findAll] userId=${userId} | status=${status ?? 'todos'}`);
    try {
      const result = await (this.prisma as any).task.findMany({
        where: {
          userId,
          ...(status ? { status } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });
      this.logger.log(`[findAll] OK | total=${result.length}`);
      return result;
    } catch (error) {
      this.logger.error(`[findAll] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(userId: string, taskId: string) {
    this.logger.log(`[findOne] userId=${userId} | taskId=${taskId}`);
    try {
      const task = await (this.prisma as any).task.findUnique({ where: { id: taskId } });
      if (!task) {
        this.logger.warn(`[findOne] Tarefa não encontrada | taskId=${taskId}`);
        throw new NotFoundException('Tarefa não encontrada');
      }
      if (task.userId !== userId) {
        this.logger.warn(`[findOne] Acesso negado | taskId=${taskId} | userId=${userId}`);
        throw new ForbiddenException('Acesso negado');
      }
      this.logger.log(`[findOne] OK | taskId=${taskId}`);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      this.logger.error(`[findOne] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    this.logger.log(`[update] userId=${userId} | taskId=${taskId} | dto=${JSON.stringify(dto)}`);
    try {
      await this.findOne(userId, taskId);
      const result = await (this.prisma as any).task.update({
        where: { id: taskId },
        data: {
          ...dto,
          ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
        },
      });
      this.logger.log(`[update] OK | taskId=${taskId}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      this.logger.error(`[update] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(userId: string, taskId: string) {
    this.logger.log(`[remove] userId=${userId} | taskId=${taskId}`);
    try {
      await this.findOne(userId, taskId);
      await (this.prisma as any).task.delete({ where: { id: taskId } });
      this.logger.log(`[remove] OK | taskId=${taskId}`);
      return { message: 'Tarefa removida com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      this.logger.error(`[remove] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }

  async getStats(userId: string) {
    this.logger.log(`[getStats] userId=${userId}`);
    try {
      const [total, pending, inProgress, done] = await Promise.all([
        (this.prisma as any).task.count({ where: { userId } }),
        (this.prisma as any).task.count({ where: { userId, status: 'PENDING' } }),
        (this.prisma as any).task.count({ where: { userId, status: 'IN_PROGRESS' } }),
        (this.prisma as any).task.count({ where: { userId, status: 'DONE' } }),
      ]);
      this.logger.log(`[getStats] OK | total=${total} pending=${pending} inProgress=${inProgress} done=${done}`);
      return { total, pending, inProgress, done };
    } catch (error) {
      this.logger.error(`[getStats] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateDaily(userId: string) {
    this.logger.log(`[generateDaily] INICIO | userId=${userId}`);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      this.logger.log(`[generateDaily] timezone offset=${new Date().getTimezoneOffset()}min | today=${today.toISOString()} | tomorrow=${tomorrow.toISOString()}`);

      const existing = await (this.prisma as any).task.findMany({
        where: {
          userId,
          createdAt: { gte: today, lt: tomorrow },
          description: 'daily',
        },
      });
      this.logger.log(`[generateDaily] tasks diárias existentes hoje: ${existing.length}`);

      if (existing.length > 0) {
        this.logger.log(`[generateDaily] Retornando existentes, sem criar novas`);
        return existing;
      }

      const allDaily = await (this.prisma as any).dailyTask.findMany();
      this.logger.log(`[generateDaily] dailyTasks disponíveis no banco: ${allDaily.length}`);

      if (allDaily.length === 0) {
        this.logger.error(`[generateDaily] ERRO CRÍTICO: tabela dailyTask está vazia!`);
        throw new Error('Nenhuma dailyTask cadastrada no banco');
      }

      const shuffled = allDaily.sort(() => Math.random() - 0.5).slice(0, 6);
      this.logger.log(`[generateDaily] tasks selecionadas: ${shuffled.map((t: any) => t.title).join(', ')}`);

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

      this.logger.log(`[generateDaily] OK | ${created.length} tasks criadas | ids=${created.map((t: any) => t.id).join(', ')}`);
      return created;
    } catch (error) {
      this.logger.error(`[generateDaily] ERRO | ${error.message}`, error.stack);
      throw error;
    }
  }
}