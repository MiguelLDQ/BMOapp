"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TasksService = TasksService_1 = class TasksService {
    prisma;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        this.logger.log(`[create] userId=${userId} | dto=${JSON.stringify(dto)}`);
        try {
            const result = await this.prisma.task.create({
                data: {
                    userId,
                    title: dto.title,
                    description: dto.description,
                    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                },
            });
            this.logger.log(`[create] OK | taskId=${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[create] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll(userId, status) {
        this.logger.log(`[findAll] userId=${userId} | status=${status ?? 'todos'}`);
        try {
            const result = await this.prisma.task.findMany({
                where: {
                    userId,
                    ...(status ? { status } : {}),
                },
                orderBy: { createdAt: 'desc' },
            });
            this.logger.log(`[findAll] OK | total=${result.length}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[findAll] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(userId, taskId) {
        this.logger.log(`[findOne] userId=${userId} | taskId=${taskId}`);
        try {
            const task = await this.prisma.task.findUnique({ where: { id: taskId } });
            if (!task) {
                this.logger.warn(`[findOne] Tarefa não encontrada | taskId=${taskId}`);
                throw new common_1.NotFoundException('Tarefa não encontrada');
            }
            if (task.userId !== userId) {
                this.logger.warn(`[findOne] Acesso negado | taskId=${taskId} | userId=${userId}`);
                throw new common_1.ForbiddenException('Acesso negado');
            }
            this.logger.log(`[findOne] OK | taskId=${taskId}`);
            return task;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`[findOne] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(userId, taskId, dto) {
        this.logger.log(`[update] userId=${userId} | taskId=${taskId} | dto=${JSON.stringify(dto)}`);
        try {
            await this.findOne(userId, taskId);
            const result = await this.prisma.task.update({
                where: { id: taskId },
                data: {
                    ...dto,
                    ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
                },
            });
            this.logger.log(`[update] OK | taskId=${taskId}`);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`[update] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(userId, taskId) {
        this.logger.log(`[remove] userId=${userId} | taskId=${taskId}`);
        try {
            await this.findOne(userId, taskId);
            await this.prisma.task.delete({ where: { id: taskId } });
            this.logger.log(`[remove] OK | taskId=${taskId}`);
            return { message: 'Tarefa removida com sucesso' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`[remove] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
    async getStats(userId) {
        this.logger.log(`[getStats] userId=${userId}`);
        try {
            const [total, pending, inProgress, done] = await Promise.all([
                this.prisma.task.count({ where: { userId } }),
                this.prisma.task.count({ where: { userId, status: 'PENDING' } }),
                this.prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
                this.prisma.task.count({ where: { userId, status: 'DONE' } }),
            ]);
            this.logger.log(`[getStats] OK | total=${total} pending=${pending} inProgress=${inProgress} done=${done}`);
            return { total, pending, inProgress, done };
        }
        catch (error) {
            this.logger.error(`[getStats] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateDaily(userId) {
        this.logger.log(`[generateDaily] INICIO | userId=${userId}`);
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.logger.log(`[generateDaily] timezone offset=${new Date().getTimezoneOffset()}min | today=${today.toISOString()} | tomorrow=${tomorrow.toISOString()}`);
            const existing = await this.prisma.task.findMany({
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
            const allDaily = await this.prisma.dailyTask.findMany();
            this.logger.log(`[generateDaily] dailyTasks disponíveis no banco: ${allDaily.length}`);
            if (allDaily.length === 0) {
                this.logger.error(`[generateDaily] ERRO CRÍTICO: tabela dailyTask está vazia!`);
                throw new Error('Nenhuma dailyTask cadastrada no banco');
            }
            const shuffled = allDaily.sort(() => Math.random() - 0.5).slice(0, 6);
            this.logger.log(`[generateDaily] tasks selecionadas: ${shuffled.map((t) => t.title).join(', ')}`);
            const created = await Promise.all(shuffled.map((t) => this.prisma.task.create({
                data: {
                    userId,
                    title: t.title,
                    description: 'daily',
                    dueDate: tomorrow,
                },
            })));
            this.logger.log(`[generateDaily] OK | ${created.length} tasks criadas | ids=${created.map((t) => t.id).join(', ')}`);
            return created;
        }
        catch (error) {
            this.logger.error(`[generateDaily] ERRO | ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map