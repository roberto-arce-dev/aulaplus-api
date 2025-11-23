import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEstudianteProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  grado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apoderado?: string;

}
