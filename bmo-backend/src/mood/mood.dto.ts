import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMoodDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  mood: number; // 1=Muito ruim, 2=Ruim, 3=Neutro, 4=Bem, 5=Muito bem

  @IsOptional()
  @IsString()
  note?: string;
}
