import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMoodDto } from './mood.dto';

const MOOD_LABELS: Record<number, string> = {
  1: 'Muito ruim',
  2: 'Ruim',
  3: 'Neutro',
  4: 'Bem',
  5: 'Muito bem',
};

@Injectable()
export class MoodService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMoodDto) {
    const entry = await (this.prisma as any).moodEntry.create({
      data: { userId, mood: dto.mood, note: dto.note },
    });
    return { ...entry, moodLabel: MOOD_LABELS[entry.mood] };
  }

  async findAll(userId: string, limit = 30) {
    const entries = await (this.prisma as any).moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return entries.map((e: any) => ({ ...e, moodLabel: MOOD_LABELS[e.mood] }));
  }

  async getStats(userId: string) {
    const entries = await (this.prisma as any).moodEntry.findMany({
      where: { userId },
      select: { mood: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    if (entries.length === 0) {
      return { average: null, total: 0, distribution: {}, trend: [] };
    }

    const total = entries.length;
    const average = entries.reduce((sum: number, e: any) => sum + e.mood, 0) / total;

    const distribution: Record<string, number> = {};
    for (let i = 1; i <= 5; i++) {
      distribution[MOOD_LABELS[i]] = entries.filter((e: any) => e.mood === i).length;
    }

    // Últimos 7 registros para tendência
    const trend = entries.slice(0, 7).reverse().map((e: any) => ({
      mood: e.mood,
      label: MOOD_LABELS[e.mood],
      date: e.createdAt,
    }));

    return {
      average: Math.round(average * 10) / 10,
      averageLabel: MOOD_LABELS[Math.round(average)],
      total,
      distribution,
      trend,
    };
  }
}
