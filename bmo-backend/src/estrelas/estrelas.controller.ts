import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { EstrelasService } from './estrelas.service';
import { CreateEstrelasDto } from './estrelas.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('estrelas')
export class EstrelasController {
  constructor(private estrelasService: EstrelasService) {}

  @Post()
  async send(@Body() dto: CreateEstrelasDto) {
    const data = await this.estrelasService.send(dto);
    return { success: true, message: 'Mensagem enviada ao mar 🌊', data };
  }

  @Get()
  async receive() {
    const data = await this.estrelasService.receive();
    return { success: true, data };
  }
}