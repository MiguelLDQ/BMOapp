import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './mood.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('mood')
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateMoodDto) {
    const data = await this.moodService.create(userId, dto);
    return { success: true, message: 'Humor registrado!', data };
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.moodService.findAll(userId, limit ? parseInt(limit) : 30);
    return { success: true, data };
  }

  @Get('stats')
  async getStats(@CurrentUser('id') userId: string) {
    const data = await this.moodService.getStats(userId);
    return { success: true, data };
  }
}
