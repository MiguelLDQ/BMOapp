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
exports.EstrelasController = void 0;
const common_1 = require("@nestjs/common");
const estrelas_service_1 = require("./estrelas.service");
const estrelas_dto_1 = require("./estrelas.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let EstrelasController = class EstrelasController {
    estrelasService;
    constructor(estrelasService) {
        this.estrelasService = estrelasService;
    }
    async send(dto) {
        const data = await this.estrelasService.send(dto);
        return { success: true, message: 'Mensagem enviada ao mar 🌊', data };
    }
    async receive() {
        const data = await this.estrelasService.receive();
        return { success: true, data };
    }
};
exports.EstrelasController = EstrelasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estrelas_dto_1.CreateEstrelasDto]),
    __metadata("design:returntype", Promise)
], EstrelasController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EstrelasController.prototype, "receive", null);
exports.EstrelasController = EstrelasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('estrelas'),
    __metadata("design:paramtypes", [estrelas_service_1.EstrelasService])
], EstrelasController);
//# sourceMappingURL=estrelas.controller.js.map