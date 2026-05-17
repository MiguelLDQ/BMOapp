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
var ChatCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCleanupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const firebase_service_1 = require("../firebase.service");
let ChatCleanupService = ChatCleanupService_1 = class ChatCleanupService {
    prisma;
    firebase;
    logger = new common_1.Logger(ChatCleanupService_1.name);
    constructor(prisma, firebase) {
        this.prisma = prisma;
        this.firebase = firebase;
    }
    async cleanupDaily() {
        this.logger.log('Iniciando limpeza diária do chat...');
        try {
            const deleted = await this.prisma.message.deleteMany({});
            this.logger.log(`${deleted.count} mensagens deletadas do PostgreSQL`);
            if (this.firebase.isAvailable()) {
                await this.firebase.db.ref('rooms').remove();
                this.logger.log('Firebase limpo com sucesso');
            }
            return {
                success: true,
                deletedMessages: deleted.count,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Erro na limpeza: ${error.message}`);
            throw error;
        }
    }
};
exports.ChatCleanupService = ChatCleanupService;
exports.ChatCleanupService = ChatCleanupService = ChatCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        firebase_service_1.FirebaseService])
], ChatCleanupService);
//# sourceMappingURL=chat-cleanup.service.js.map