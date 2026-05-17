import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class ChatCleanupService {
  private readonly logger = new Logger(ChatCleanupService.name);

  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  async cleanupDaily() {
    this.logger.log('Iniciando limpeza diária do chat...');

    try {
      // Deleta todas as mensagens do PostgreSQL
      const deleted = await (this.prisma as any).message.deleteMany({});
      this.logger.log(`${deleted.count} mensagens deletadas do PostgreSQL`);

      // Limpa o Firebase Realtime Database
      if (this.firebase.isAvailable()) {
        await (this.firebase as any).db.ref('rooms').remove();
        this.logger.log('Firebase limpo com sucesso');
      }

      return {
        success: true,
        deletedMessages: deleted.count,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Erro na limpeza: ${error.message}`);
      throw error;
    }
  }
}