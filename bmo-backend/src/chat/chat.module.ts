import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatCleanupService } from './chat-cleanup.service';
import { ChatCleanupController } from './chat-cleanup.controller';
import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';

@Module({
  controllers: [ChatController, ChatCleanupController],
  providers: [ChatService, ChatCleanupService, PrismaService, FirebaseService],
})
export class ChatModule {}