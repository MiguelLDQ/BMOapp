import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateEstrelasDto {
  @IsString()
  @MinLength(10, { message: 'Mensagem muito curta' })
  @MaxLength(500, { message: 'Mensagem muito longa' })
  content: string;
}