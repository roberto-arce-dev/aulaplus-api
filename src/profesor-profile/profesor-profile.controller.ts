import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProfesorProfileService } from './profesor-profile.service';
import { CreateProfesorProfileDto } from './dto/create-profesor-profile.dto';
import { UpdateProfesorProfileDto } from './dto/update-profesor-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('profesor-profile')
@ApiBearerAuth()
@Controller('profesor-profile')
export class ProfesorProfileController {
  constructor(private readonly profesorprofileService: ProfesorProfileService) {}

  @Get('me')
  @Roles(Role.PROFESOR)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.profesorprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.PROFESOR)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdateProfesorProfileDto) {
    return this.profesorprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.profesorprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.profesorprofileService.findByUserId(userId);
  }
}
