export declare class ChatMessageDto {
    role: 'user' | 'assistant';
    content: string;
}
export declare class SendMessageDto {
    message: string;
    history?: ChatMessageDto[];
}
