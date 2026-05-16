import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './chatbot.dto';
export declare class ChatbotService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    sendMessage(userId: string, dto: SendMessageDto): Promise<{
        reply: any;
        responseLength: "short" | "medium" | "long";
        model: string;
        tokensUsed: any;
    }>;
    checkHealth(): Promise<{
        online: boolean;
        model: string;
        provider: string;
    }>;
}
