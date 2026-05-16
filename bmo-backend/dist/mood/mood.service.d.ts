import { PrismaService } from '../prisma.service';
import { CreateMoodDto } from './mood.dto';
export declare class MoodService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateMoodDto): Promise<any>;
    findAll(userId: string, limit?: number): Promise<any>;
    getStats(userId: string): Promise<{
        average: any;
        total: number;
        distribution: {};
        trend: any[];
        averageLabel?: undefined;
    } | {
        average: number;
        averageLabel: string;
        total: any;
        distribution: Record<string, number>;
        trend: any;
    }>;
}
