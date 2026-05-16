import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(userId: string, dto: CreateTaskDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findAll(userId: string, status?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getStats(userId: string): Promise<{
        success: boolean;
        data: {
            total: any;
            pending: any;
            inProgress: any;
            done: any;
        };
    }>;
    findOne(userId: string, id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(userId: string, id: string, dto: UpdateTaskDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
