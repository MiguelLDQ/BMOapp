import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, FirebaseService],
})
export class ChatModule {}
