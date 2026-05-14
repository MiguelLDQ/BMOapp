import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private db: any = null;
  private admin: any = null;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    try {
      this.admin = require('firebase-admin');

      const serviceAccount = this.config.get('firebase.serviceAccount');

      if (!serviceAccount) {
        this.logger.warn('Firebase não configurado. Chat em tempo real desativado.');
        return;
      }

      if (!this.admin.apps.length) {
        this.admin.initializeApp({
          credential: this.admin.credential.cert(JSON.parse(serviceAccount)),
          databaseURL: this.config.get('firebase.databaseURL'),
        });
      }

      this.db = this.admin.database();
      this.logger.log('Firebase conectado com sucesso!');
    } catch (err: any) {
      this.logger.error(`Erro ao inicializar Firebase: ${err.message}`);
    }
  }

  isAvailable(): boolean {
    return this.db !== null;
  }

  // Salva mensagem no Firebase Realtime Database
  async saveMessage(roomId: string, message: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
  }) {
    if (!this.db) return;
    await this.db.ref(`rooms/${roomId}/messages/${message.id}`).set(message);
  }

  // Deleta mensagem do Firebase (moderação)
  async deleteMessage(roomId: string, messageId: string) {
    if (!this.db) return;
    await this.db.ref(`rooms/${roomId}/messages/${messageId}`).update({
      content: '[Mensagem removida pelo moderador]',
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });
  }

  // Marca usuário como banido no Firebase (App Inventor consegue reagir)
  async banUser(userId: string, reason: string) {
    if (!this.db) return;
    await this.db.ref(`users/${userId}`).update({
      isBanned: true,
      banReason: reason,
      bannedAt: new Date().toISOString(),
    });
  }

  async unbanUser(userId: string) {
    if (!this.db) return;
    await this.db.ref(`users/${userId}`).update({
      isBanned: false,
      banReason: null,
      bannedAt: null,
    });
  }
}
