import {
  Controller, Get, Post, Delete, Patch,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { BanUserDto, ResolveReportDto } from './admin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  async getDashboard() {
    const data = await this.adminService.getDashboard();
    return { success: true, data };
  }

  // Usuários
  @Get('users')
  async listUsers(@Query('search') search?: string) {
    const data = await this.adminService.listUsers(search);
    return { success: true, data };
  }

  @Post('users/:userId/ban')
  async banUser(@Param('userId') userId: string, @Body() dto: BanUserDto) {
    const data = await this.adminService.banUser(userId, dto);
    return { success: true, ...data };
  }

  @Post('users/:userId/unban')
  async unbanUser(@Param('userId') userId: string) {
    const data = await this.adminService.unbanUser(userId);
    return { success: true, ...data };
  }

  @Post('users/:userId/promote')
  async promoteToAdmin(@Param('userId') userId: string) {
    const data = await this.adminService.promoteToAdmin(userId);
    return { success: true, ...data };
  }

  // Denúncias
  @Get('reports')
  async listReports(@Query('status') status?: string) {
    const data = await this.adminService.listReports(status);
    return { success: true, data };
  }

  @Patch('reports/:reportId/resolve')
  async resolveReport(
    @Param('reportId') reportId: string,
    @Body() dto: ResolveReportDto,
  ) {
    const data = await this.adminService.resolveReport(reportId, dto);
    return { success: true, ...data };
  }

  // Mensagens
  @Delete('messages/:messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    const data = await this.adminService.deleteMessage(messageId);
    return { success: true, ...data };
  }
  @Delete('rooms/:roomId')
async deleteRoom(@Param('roomId') roomId: string) {
  const data = await this.adminService.deleteRoom(roomId);
  return { success: true, ...data };
}
}
