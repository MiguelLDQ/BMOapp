import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateTaskDto) {
    const data = await this.tasksService.create(userId, dto);
    return { success: true, message: 'Tarefa criada', data };
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
  ) {
    const data = await this.tasksService.findAll(userId, status);
    return { success: true, data };
  }

  @Get('stats')
  async getStats(@CurrentUser('id') userId: string) {
    const data = await this.tasksService.getStats(userId);
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.tasksService.findOne(userId, id);
    return { success: true, data };
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const data = await this.tasksService.update(userId, id, dto);
    return { success: true, message: 'Tarefa atualizada', data };
  }

  @Delete(':id')
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.tasksService.remove(userId, id);
    return { success: true, ...data };
  }
}
