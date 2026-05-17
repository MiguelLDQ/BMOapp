import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEstrelasDto } from './estrelas.dto';

@Injectable()
export class EstrelasService {
  constructor(private prisma: PrismaService) {}

  async send(dto: CreateEstrelasDto) {
    return (this.prisma as any).estrelasMensagem.create({
      data: { content: dto.content },
    });
  }

  async receive() {
    const count = await (this.prisma as any).estrelasMensagem.count();
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const msgs = await (this.prisma as any).estrelasMensagem.findMany({
      take: 3,
      skip,
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });
    return msgs;
  }
}