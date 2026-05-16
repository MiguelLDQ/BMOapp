import { ChatService } from './chat.service';
import { CreateRoomDto, SendChatMessageDto, ReportMessageDto } from './chat.dto';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    listRooms(): Promise<{
        success: boolean;
        data: any;
    }>;
    createRoom(userId: string, dto: CreateRoomDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    joinRoom(userId: string, roomId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    leaveRoom(userId: string, roomId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    sendMessage(user: any, roomId: string, dto: SendChatMessageDto): Promise<{
        success: boolean;
        data: any;
    }>;
    getMessages(userId: string, roomId: string, limit?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    reportMessage(userId: string, messageId: string, dto: ReportMessageDto): Promise<{
        message: string;
        report: any;
        success: boolean;
    }>;
}
