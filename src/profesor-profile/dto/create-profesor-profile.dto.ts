import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfesorProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreCompleto: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  especialidad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  grados?: string[];

}
