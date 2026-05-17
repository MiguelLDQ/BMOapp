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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCleanupController = void 0;
const common_1 = require("@nestjs/common");
const chat_cleanup_service_1 = require("./chat-cleanup.service");
const config_1 = require("@nestjs/config");
let ChatCleanupController = class ChatCleanupController {
    cleanupService;
    config;
    constructor(cleanupService, config) {
        this.cleanupService = cleanupService;
        this.config = config;
    }
    async cleanup(secret) {
        const expected = this.config.get('cleanup.secret');
        if (!secret || secret !== expected) {
            throw new common_1.UnauthorizedException('Acesso negado');
        }
        const result = await this.cleanupService.cleanupDaily();
        return { success: true, data: result };
    }
};
exports.ChatCleanupController = ChatCleanupController;
__decorate([
    (0, common_1.Post)('cleanup-chat'),
    __param(0, (0, common_1.Headers)('x-cleanup-secret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatCleanupController.prototype, "cleanup", null);
exports.ChatCleanupController = ChatCleanupController = __decorate([
    (0, common_1.Controller)('internal'),
    __metadata("design:paramtypes", [chat_cleanup_service_1.ChatCleanupService,
        config_1.ConfigService])
], ChatCleanupController);
//# sourceMappingURL=chat-cleanup.controller.js.map