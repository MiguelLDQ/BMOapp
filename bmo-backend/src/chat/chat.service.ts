import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';
import { moderateMessage } from './moderation';
import { CreateRoomDto, SendChatMessageDto, ReportMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  // ─── SALAS ───────────────────────────────────────────────

  async createRoom(userId: string, dto: CreateRoomDto) {
    const room = await (this.prisma as any).chatRoom.create({
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
    return (this.prisma as any).chatRoom.findMany({
      include: {
        _count: { select: { members: true, messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async joinRoom(userId: string, roomId: string) {
    const room = await (this.prisma as any).chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Sala não encontrada');

    const alreadyMember = await (this.prisma as any).chatMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (alreadyMember) return { message: 'Você já está nesta sala' };

    await (this.prisma as any).chatMember.create({ data: { roomId, userId } });
    return { message: 'Entrou na sala com sucesso' };
  }

  async leaveRoom(userId: string, roomId: string) {
    await (this.prisma as any).chatMember.deleteMany({ where: { roomId, userId } });
    return { message: 'Saiu da sala' };
  }

  // ─── MENSAGENS ───────────────────────────────────────────

  async sendMessage(userId: string, roomId: string, dto: SendChatMessageDto, userName: string) {
    // 1. Verifica se é membro da sala
    const isMember = await (this.prisma as any).chatMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!isMember) throw new ForbiddenException('Você não é membro desta sala');

    // 2. Moderação automática
    const modResult = moderateMessage(dto.content);
    if (modResult.blocked) {
      throw new BadRequestException(modResult.reason || 'Mensagem bloqueada');
    }

    // 3. Salva no PostgreSQL
    const message = await (this.prisma as any).message.create({
      data: { roomId, userId, content: dto.content },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    // 4. Sincroniza com Firebase (tempo real)
    await this.firebase.saveMessage(roomId, {
      id: message.id,
      userId,
      userName,
      content: dto.content,
      createdAt: message.createdAt.toISOString(),
    });

    return message;
  }

  async getMessages(userId: string, roomId: string, limit = 50) {
    const isMember = await (this.prisma as any).chatMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!isMember) throw new ForbiddenException('Você não é membro desta sala');

    return (this.prisma as any).message.findMany({
      where: { roomId, isDeleted: false },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // ─── DENÚNCIAS ───────────────────────────────────────────

  async reportMessage(reportedById: string, messageId: string, dto: ReportMessageDto) {
    const message = await (this.prisma as any).message.findUnique({
      where: { id: messageId },
      include: { user: true },
    });
    if (!message) throw new NotFoundException('Mensagem não encontrada');
    if (message.userId === reportedById) {
      throw new BadRequestException('Você não pode denunciar sua própria mensagem');
    }

    const report = await (this.prisma as any).report.create({
      data: {
        messageId,
        reportedById,
        reportedUserId: message.userId,
        reason: dto.reason,
      },
    });

    return { message: 'Denúncia enviada. Nossa equipe irá analisar em breve.', report };
  }
}
