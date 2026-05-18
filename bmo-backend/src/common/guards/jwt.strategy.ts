import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'bmo-secret-change-in-production',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, avatar: true, role: true, isBanned: true },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    if (user.isBanned) throw new UnauthorizedException('Conta suspensa');
    return user;
  }
}