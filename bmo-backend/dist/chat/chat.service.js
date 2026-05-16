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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const firebase_service_1 = require("../firebase.service");
const moderation_1 = require("./moderation");
let ChatService = class ChatService {
    prisma;
    firebase;
    constructor(prisma, firebase) {
        this.prisma = prisma;
        this.firebase = firebase;
    }
    async createRoom(userId, dto) {
        const room = await this.prisma.chatRoom.create({
            data: {
                name: dto.name,
                type: dto.type || 'GROUP',
                members: { create: { userId } },
            },
            include: { members: true },
        });
        return room;
    }
    async listRooms() {
        return this.prisma.chatRoom.findMany({
            include: {
                _count: { select: { members: true, messages: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async joinRoom(userId, roomId) {
        const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Sala não encontrada');
        const alreadyMember = await this.prisma.chatMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (alreadyMember)
            return { message: 'Você já está nesta sala' };
        await this.prisma.chatMember.create({ data: { roomId, userId } });
        return { message: 'Entrou na sala com sucesso' };
    }
    async leaveRoom(userId, roomId) {
        await this.prisma.chatMember.deleteMany({ where: { roomId, userId } });
        return { message: 'Saiu da sala' };
    }
    async sendMessage(userId, roomId, dto, userName) {
        const isMember = await this.prisma.chatMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (!isMember)
            throw new common_1.ForbiddenException('Você não é membro desta sala');
        const modResult = (0, moderation_1.moderateMessage)(dto.content);
        if (modResult.blocked) {
            throw new common_1.BadRequestException(modResult.reason || 'Mensagem bloqueada');
        }
        const message = await this.prisma.message.create({
            data: { roomId, userId, content: dto.content },
            include: { user: { select: { id: true, name: true, avatar: true } } },
        });
        await this.firebase.saveMessage(roomId, {
            id: message.id,
            userId,
            userName,
            content: dto.content,
            createdAt: message.createdAt.toISOString(),
        });
        return message;
    }
    async getMessages(userId, roomId, limit = 50) {
        const isMember = await this.prisma.chatMember.findUnique({
            where: { roomId_userId: { roomId, userId } },
        });
        if (!isMember)
            throw new common_1.ForbiddenException('Você não é membro desta sala');
        return this.prisma.message.findMany({
            where: { roomId, isDeleted: false },
            include: { user: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async reportMessage(reportedById, messageId, dto) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
            include: { user: true },
        });
        if (!message)
            throw new common_1.NotFoundException('Mensagem não encontrada');
        if (message.userId === reportedById) {
            throw new common_1.BadRequestException('Você não pode denunciar sua própria mensagem');
        }
        const report = await this.prisma.report.create({
            data: {
                messageId,
                reportedById,
                reportedUserId: message.userId,
                reason: dto.reason,
            },
        });
        return { message: 'Denúncia enviada. Nossa equipe irá analisar em breve.', report };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        firebase_service_1.FirebaseService])
], ChatService);
//# sourceMappingURL=chat.service.js.map