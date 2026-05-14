import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './chatbot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('message')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    const data = await this.chatbotService.sendMessage(userId, dto);
    return { success: true, data };
  }

  @Get('health')
  async checkHealth() {
    const data = await this.chatbotService.checkHealth();
    return { success: true, data };
  }
}
