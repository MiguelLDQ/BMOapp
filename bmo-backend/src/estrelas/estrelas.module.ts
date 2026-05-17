import { Module } from '@nestjs/common';
import { EstrelasService } from './estrelas.service';
import { EstrelasController } from './estrelas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EstrelasController],
  providers: [EstrelasService, PrismaService],
})
export class EstrelasModule {}