import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['PRIVATE', 'GROUP'])
  type?: 'PRIVATE' | 'GROUP';
}

export class SendChatMessageDto {
  @IsString()
  content: string;
}

export class ReportMessageDto {
  @IsString()
  reason: string;
}

export class JoinRoomDto {
  @IsString()
  roomId: string;
}
