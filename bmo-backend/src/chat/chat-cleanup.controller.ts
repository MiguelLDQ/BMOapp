import { Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { ChatCleanupService } from './chat-cleanup.service';
import { ConfigService } from '@nestjs/config';

@Controller('internal')
export class ChatCleanupController {
  constructor(
    private cleanupService: ChatCleanupService,
    private config: ConfigService,
  ) {}

  @Post('cleanup-chat')
  async cleanup(@Headers('x-cleanup-secret') secret: string) {
    const expected = this.config.get<string>('cleanup.secret');
    if (!secret || secret !== expected) {
      throw new UnauthorizedException('Acesso negado');
    }
    const result = await this.cleanupService.cleanupDaily();
    return { success: true, data: result };
  }
}