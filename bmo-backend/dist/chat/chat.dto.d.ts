export declare class CreateRoomDto {
    name?: string;
    type?: 'PRIVATE' | 'GROUP';
}
export declare class SendChatMessageDto {
    content: string;
}
export declare class ReportMessageDto {
    reason: string;
}
export declare class JoinRoomDto {
    roomId: string;
}
