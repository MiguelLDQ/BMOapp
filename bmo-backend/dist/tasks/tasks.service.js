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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.task.create({
            data: {
                userId,
                title: dto.title,
                description: dto.description,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
        });
    }
    async findAll(userId, status) {
        return this.prisma.task.findMany({
            where: {
                userId,
                ...(status ? { status } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, taskId) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!task)
            throw new common_1.NotFoundException('Tarefa não encontrada');
        if (task.userId !== userId)
            throw new common_1.ForbiddenException('Acesso negado');
        return task;
    }
    async update(userId, taskId, dto) {
        await this.findOne(userId, taskId);
        return this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...dto,
                ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
            },
        });
    }
    async remove(userId, taskId) {
        await this.findOne(userId, taskId);
        await this.prisma.task.delete({ where: { id: taskId } });
        return { message: 'Tarefa removida com sucesso' };
    }
    async getStats(userId) {
        const [total, pending, inProgress, done] = await Promise.all([
            this.prisma.task.count({ where: { userId } }),
            this.prisma.task.count({ where: { userId, status: 'PENDING' } }),
            this.prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
            this.prisma.task.count({ where: { userId, status: 'DONE' } }),
        ]);
        return { total, pending, inProgress, done };
    }
    async generateDaily(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const existing = await this.prisma.task.findMany({
            where: {
                userId,
                createdAt: { gte: today, lt: tomorrow },
                description: 'daily',
            },
        });
        if (existing.length > 0) {
            return existing;
        }
        const allDaily = await this.prisma.dailyTask.findMany();
        const shuffled = allDaily.sort(() => Math.random() - 0.5).slice(0, 6);
        const created = await Promise.all(shuffled.map((t) => this.prisma.task.create({
            data: {
                userId,
                title: t.title,
                description: 'daily',
                dueDate: tomorrow,
            },
        })));
        return created;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map