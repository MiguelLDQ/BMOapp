"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let FirebaseService = FirebaseService_1 = class FirebaseService {
    config;
    logger = new common_1.Logger(FirebaseService_1.name);
    db = null;
    admin = null;
    constructor(config) {
        this.config = config;
    }
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
        }
        catch (err) {
            this.logger.error(`Erro ao inicializar Firebase: ${err.message}`);
        }
    }
    isAvailable() {
        return this.db !== null;
    }
    async saveMessage(roomId, message) {
        if (!this.db)
            return;
        await this.db.ref(`rooms/${roomId}/messages/${message.id}`).set(message);
    }
    async deleteMessage(roomId, messageId) {
        if (!this.db)
            return;
        await this.db.ref(`rooms/${roomId}/messages/${messageId}`).update({
            content: '[Mensagem removida pelo moderador]',
            isDeleted: true,
            deletedAt: new Date().toISOString(),
        });
    }
    async banUser(userId, reason) {
        if (!this.db)
            return;
        await this.db.ref(`users/${userId}`).update({
            isBanned: true,
            banReason: reason,
            bannedAt: new Date().toISOString(),
        });
    }
    async unbanUser(userId) {
        if (!this.db)
            return;
        await this.db.ref(`users/${userId}`).update({
            isBanned: false,
            banReason: null,
            bannedAt: null,
        });
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map