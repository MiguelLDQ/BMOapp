import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, FirebaseService],
})
export class AdminModule {}
