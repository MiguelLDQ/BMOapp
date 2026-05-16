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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const MOOD_LABELS = {
    1: 'Muito ruim',
    2: 'Ruim',
    3: 'Neutro',
    4: 'Bem',
    5: 'Muito bem',
};
let MoodService = class MoodService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const entry = await this.prisma.moodEntry.create({
            data: { userId, mood: dto.mood, note: dto.note },
        });
        return { ...entry, moodLabel: MOOD_LABELS[entry.mood] };
    }
    async findAll(userId, limit = 30) {
        const entries = await this.prisma.moodEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return entries.map((e) => ({ ...e, moodLabel: MOOD_LABELS[e.mood] }));
    }
    async getStats(userId) {
        const entries = await this.prisma.moodEntry.findMany({
            where: { userId },
            select: { mood: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        if (entries.length === 0) {
            return { average: null, total: 0, distribution: {}, trend: [] };
        }
        const total = entries.length;
        const average = entries.reduce((sum, e) => sum + e.mood, 0) / total;
        const distribution = {};
        for (let i = 1; i <= 5; i++) {
            distribution[MOOD_LABELS[i]] = entries.filter((e) => e.mood === i).length;
        }
        const trend = entries.slice(0, 7).reverse().map((e) => ({
            mood: e.mood,
            label: MOOD_LABELS[e.mood],
            date: e.createdAt,
        }));
        return {
            average: Math.round(average * 10) / 10,
            averageLabel: MOOD_LABELS[Math.round(average)],
            total,
            distribution,
            trend,
        };
    }
};
exports.MoodService = MoodService;
exports.MoodService = MoodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MoodService);
//# sourceMappingURL=mood.service.js.map