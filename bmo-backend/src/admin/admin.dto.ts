import { IsString, IsOptional, IsEnum } from 'class-validator';

export class BanUserDto {
  @IsString()
  reason: string;
}

export class ResolveReportDto {
  @IsEnum(['RESOLVED', 'DISMISSED'])
  status: 'RESOLVED' | 'DISMISSED';

  @IsOptional()
  @IsString()
  note?: string;
}
