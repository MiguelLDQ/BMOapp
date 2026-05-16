export declare enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export declare class CreateTaskDto {
    title: string;
    description?: string;
    dueDate?: string;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
}
