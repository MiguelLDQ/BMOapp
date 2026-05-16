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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_dto_1 = require("./chat.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const banned_guard_1 = require("../common/guards/banned.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async listRooms() {
        const data = await this.chatService.listRooms();
        return { success: true, data };
    }
    async createRoom(userId, dto) {
        const data = await this.chatService.createRoom(userId, dto);
        return { success: true, message: 'Sala criada', data };
    }
    async joinRoom(userId, roomId) {
        const data = await this.chatService.joinRoom(userId, roomId);
        return { success: true, ...data };
    }
    async leaveRoom(userId, roomId) {
        const data = await this.chatService.leaveRoom(userId, roomId);
        return { success: true, ...data };
    }
    async sendMessage(user, roomId, dto) {
        const data = await this.chatService.sendMessage(user.id, roomId, dto, user.name);
        return { success: true, data };
    }
    async getMessages(userId, roomId, limit) {
        const data = await this.chatService.getMessages(userId, roomId, limit ? parseInt(limit) : 50);
        return { success: true, data };
    }
    async reportMessage(userId, messageId, dto) {
        const data = await this.chatService.reportMessage(userId, messageId, dto);
        return { success: true, ...data };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('rooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listRooms", null);
__decorate([
    (0, common_1.Post)('rooms'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/join'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Delete)('rooms/:roomId/leave'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('roomId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, chat_dto_1.SendChatMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('roomId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/report'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, chat_dto_1.ReportMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "reportMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, banned_guard_1.BannedGuard),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map