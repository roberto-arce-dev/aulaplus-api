import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

/**
 * DTO para registro de usuarios
 * Crea User + Profile correspondiente según el rol
 */
export class RegisterDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: Role.ESTUDIANTE,
    description: 'Rol del usuario',
    enum: [Role.ESTUDIANTE, Role.PROFESOR],
  })
  @IsNotEmpty()
  @IsEnum([Role.ESTUDIANTE, Role.PROFESOR])
  role: Role;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: '+51 987654321',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'grado (opcional)',
  })
  @IsOptional()
  @IsString()
  grado?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'seccion (opcional)',
  })
  @IsOptional()
  @IsString()
  seccion?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'apoderado (opcional)',
  })
  @IsOptional()
  @IsString()
  apoderado?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'especialidad (para rol PROFESOR)',
  })
  @ValidateIf((o) => o.role === Role.PROFESOR)
  @IsNotEmpty({ message: 'especialidad es requerido para PROFESOR' })
  @IsString()
  especialidad?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'grados (opcional)',
  })
  @IsOptional()
  @IsArray()
  grados?: string[];

}
