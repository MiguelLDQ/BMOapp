import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';
import { BanUserDto, ResolveReportDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  // ─── USUÁRIOS ────────────────────────────────────────────

  async listUsers(search?: string) {
    return (this.prisma as any).user.findMany({
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

  async banUser(targetUserId: string, dto: BanUserDto) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await (this.prisma as any).user.update({
      where: { id: targetUserId },
      data: { isBanned: true, banReason: dto.reason },
    });

    await this.firebase.banUser(targetUserId, dto.reason);

    return { message: `Usuário ${user.name} banido com sucesso` };
  }

  async unbanUser(targetUserId: string) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await (this.prisma as any).user.update({
      where: { id: targetUserId },
      data: { isBanned: false, banReason: null },
    });

    await this.firebase.unbanUser(targetUserId);

    return { message: `Usuário ${user.name} desbanido com sucesso` };
  }

  async promoteToAdmin(targetUserId: string) {
    const user = await (this.prisma as any).user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await (this.prisma as any).user.update({
      where: { id: targetUserId },
      data: { role: 'ADMIN' },
    });

    return { message: `${user.name} agora é administrador` };
  }

  // ─── DENÚNCIAS ───────────────────────────────────────────

  async listReports(status?: string) {
    return (this.prisma as any).report.findMany({
      where: status ? { status } : undefined,
      include: {
        message: { select: { id: true, content: true, roomId: true } },
        reportedBy: { select: { id: true, name: true } },
        reportedUser: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveReport(reportId: string, dto: ResolveReportDto) {
    const report = await (this.prisma as any).report.findUnique({
      where: { id: reportId },
      include: { message: true },
    });
    if (!report) throw new NotFoundException('Denúncia não encontrada');

    await (this.prisma as any).report.update({
      where: { id: reportId },
      data: { status: dto.status, resolvedAt: new Date() },
    });

    return { message: `Denúncia marcada como ${dto.status}` };
  }

  // ─── MENSAGENS ───────────────────────────────────────────

  async deleteMessage(messageId: string) {
    const message = await (this.prisma as any).message.findUnique({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Mensagem não encontrada');

    await (this.prisma as any).message.update({
      where: { id: messageId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    await this.firebase.deleteMessage(message.roomId, messageId);

    return { message: 'Mensagem removida com sucesso' };
  }

  // ─── SALAS ───────────────────────────────────────────────

  async deleteRoom(roomId: string) {
    const room = await (this.prisma as any).chatRoom.findUnique({
      where: { id: roomId },
    });
    if (!room) throw new NotFoundException('Sala não encontrada');

    await (this.prisma as any).chatRoom.delete({ where: { id: roomId } });

    try {
      await (this.firebase as any).db.ref(`rooms/${roomId}`).remove();
    } catch (e) {}

    return { message: 'Sala removida com sucesso' };
  }

  // ─── DASHBOARD ───────────────────────────────────────────

  async getDashboard() {
    const [totalUsers, bannedUsers, pendingReports, totalMessages] = await Promise.all([
      (this.prisma as any).user.count(),
      (this.prisma as any).user.count({ where: { isBanned: true } }),
      (this.prisma as any).report.count({ where: { status: 'PENDING' } }),
      (this.prisma as any).message.count({ where: { isDeleted: false } }),
    ]);

    return { totalUsers, bannedUsers, pendingReports, totalMessages };
  }
}