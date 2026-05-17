import { ChatCleanupService } from './chat-cleanup.service';
import { ConfigService } from '@nestjs/config';
export declare class ChatCleanupController {
    private cleanupService;
    private config;
    constructor(cleanupService: ChatCleanupService, config: ConfigService);
    cleanup(secret: string): Promise<{
        success: boolean;
        data: {
            success: boolean;
            deletedMessages: any;
            timestamp: string;
        };
    }>;
}
