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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const firebase_service_1 = require("../firebase.service");
let AdminService = class AdminService {
    prisma;
    firebase;
    constructor(prisma, firebase) {
        this.prisma = prisma;
        this.firebase = firebase;
    }
    async listUsers(search) {
        return this.prisma.user.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            select: {
                id: true, name: true, email: true, role: true,
                isBanned: true, banReason: true, createdAt: true,
                _count: { select: { messages: true, reports: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async banUser(targetUserId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: { isBanned: true, banReason: dto.reason },
        });
        await this.firebase.banUser(targetUserId, dto.reason);
        return { message: `Usuário ${user.name} banido com sucesso` };
    }
    async unbanUser(targetUserId) {
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: { isBanned: false, banReason: null },
        });
        await this.firebase.unbanUser(targetUserId);
        return { message: `Usuário ${user.name} desbanido com sucesso` };
    }
    async promoteToAdmin(targetUserId) {
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: { role: 'ADMIN' },
        });
        return { message: `${user.name} agora é administrador` };
    }
    async listReports(status) {
        return this.prisma.report.findMany({
            where: status ? { status } : undefined,
            include: {
                message: { select: { id: true, content: true, roomId: true } },
                reportedBy: { select: { id: true, name: true } },
                reportedUser: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async resolveReport(reportId, dto) {
        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
            include: { message: true },
        });
        if (!report)
            throw new common_1.NotFoundException('Denúncia não encontrada');
        await this.prisma.report.update({
            where: { id: reportId },
            data: { status: dto.status, resolvedAt: new Date() },
        });
        return { message: `Denúncia marcada como ${dto.status}` };
    }
    async deleteMessage(messageId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message)
            throw new common_1.NotFoundException('Mensagem não encontrada');
        await this.prisma.message.update({
            where: { id: messageId },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        await this.firebase.deleteMessage(message.roomId, messageId);
        return { message: 'Mensagem removida com sucesso' };
    }
    async getDashboard() {
        const [totalUsers, bannedUsers, pendingReports, totalMessages] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isBanned: true } }),
            this.prisma.report.count({ where: { status: 'PENDING' } }),
            this.prisma.message.count({ where: { isDeleted: false } }),
        ]);
        return { totalUsers, bannedUsers, pendingReports, totalMessages };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        firebase_service_1.FirebaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map