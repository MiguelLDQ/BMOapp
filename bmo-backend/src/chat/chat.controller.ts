import {
  Controller, Get, Post, Delete, Body, Param,
  Query, UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto, SendChatMessageDto, ReportMessageDto } from './chat.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BannedGuard } from '../common/guards/banned.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, BannedGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Salas
  @Get('rooms')
  async listRooms() {
    const data = await this.chatService.listRooms();
    return { success: true, data };
  }

  @Post('rooms')
  async createRoom(@CurrentUser('id') userId: string, @Body() dto: CreateRoomDto) {
    const data = await this.chatService.createRoom(userId, dto);
    return { success: true, message: 'Sala criada', data };
  }

  @Post('rooms/:roomId/join')
  async joinRoom(@CurrentUser('id') userId: string, @Param('roomId') roomId: string) {
    const data = await this.chatService.joinRoom(userId, roomId);
    return { success: true, ...data };
  }

  @Delete('rooms/:roomId/leave')
  async leaveRoom(@CurrentUser('id') userId: string, @Param('roomId') roomId: string) {
    const data = await this.chatService.leaveRoom(userId, roomId);
    return { success: true, ...data };
  }

  // Mensagens
  @Post('rooms/:roomId/messages')
  async sendMessage(
    @CurrentUser() user: any,
    @Param('roomId') roomId: string,
    @Body() dto: SendChatMessageDto,
  ) {
    const data = await this.chatService.sendMessage(user.id, roomId, dto, user.name);
    return { success: true, data };
  }

  @Get('rooms/:roomId/messages')
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('roomId') roomId: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.chatService.getMessages(userId, roomId, limit ? parseInt(limit) : 50);
    return { success: true, data };
  }

  // Denúncias
  @Post('messages/:messageId/report')
  async reportMessage(
    @CurrentUser('id') userId: string,
    @Param('messageId') messageId: string,
    @Body() dto: ReportMessageDto,
  ) {
    const data = await this.chatService.reportMessage(userId, messageId, dto);
    return { success: true, ...data };
  }
}
