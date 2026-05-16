import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateTaskDto): Promise<any>;
    findAll(userId: string, status?: string): Promise<any>;
    findOne(userId: string, taskId: string): Promise<any>;
    update(userId: string, taskId: string, dto: UpdateTaskDto): Promise<any>;
    remove(userId: string, taskId: string): Promise<{
        message: string;
    }>;
    getStats(userId: string): Promise<{
        total: any;
        pending: any;
        inProgress: any;
        done: any;
    }>;
}
