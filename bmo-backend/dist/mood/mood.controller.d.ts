import { MoodService } from './mood.service';
import { CreateMoodDto } from './mood.dto';
export declare class MoodController {
    private moodService;
    constructor(moodService: MoodService);
    create(userId: string, dto: CreateMoodDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findAll(userId: string, limit?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getStats(userId: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
