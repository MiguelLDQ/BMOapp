import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class FirebaseService implements OnModuleInit {
    private config;
    private readonly logger;
    private db;
    private admin;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    isAvailable(): boolean;
    saveMessage(roomId: string, message: {
        id: string;
        userId: string;
        userName: string;
        content: string;
        createdAt: string;
    }): Promise<void>;
    deleteMessage(roomId: string, messageId: string): Promise<void>;
    banUser(userId: string, reason: string): Promise<void>;
    unbanUser(userId: string): Promise<void>;
}
