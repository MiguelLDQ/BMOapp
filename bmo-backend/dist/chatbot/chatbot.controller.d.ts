import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './chatbot.dto';
export declare class ChatbotController {
    private chatbotService;
    constructor(chatbotService: ChatbotService);
    sendMessage(userId: string, dto: SendMessageDto): Promise<{
        success: boolean;
        data: {
            reply: any;
            responseLength: "short" | "medium" | "long";
            model: string;
            tokensUsed: any;
        };
    }>;
    checkHealth(): Promise<{
        success: boolean;
        data: {
            online: boolean;
            model: string;
            provider: string;
        };
    }>;
}
