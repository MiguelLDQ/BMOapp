import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';
import { CreateRoomDto, SendChatMessageDto, ReportMessageDto } from './chat.dto';
export declare class ChatService {
    private prisma;
    private firebase;
    constructor(prisma: PrismaService, firebase: FirebaseService);
    createRoom(userId: string, dto: CreateRoomDto): Promise<any>;
    listRooms(): Promise<any>;
    joinRoom(userId: string, roomId: string): Promise<{
        message: string;
    }>;
    leaveRoom(userId: string, roomId: string): Promise<{
        message: string;
    }>;
    sendMessage(userId: string, roomId: string, dto: SendChatMessageDto, userName: string): Promise<any>;
    getMessages(userId: string, roomId: string, limit?: number): Promise<any>;
    reportMessage(reportedById: string, messageId: string, dto: ReportMessageDto): Promise<{
        message: string;
        report: any;
    }>;
}
