import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class BannedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;

    const dbUser = await (this.prisma as any).user.findUnique({
      where: { id: user.id },
      select: { isBanned: true, banReason: true },
    });

    if (dbUser?.isBanned) {
      throw new ForbiddenException(
        `Sua conta foi suspensa. Motivo: ${dbUser.banReason || 'Violação dos termos de uso'}`,
      );
    }

    return true;
  }
}
