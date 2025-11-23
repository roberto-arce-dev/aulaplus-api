import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProfesorService } from './profesor.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Profesor')
@ApiBearerAuth('JWT-auth')
@Controller('profesor')
export class ProfesorController {
  constructor(
    private readonly profesorService: ProfesorService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Profesor' })
  @ApiBody({ type: CreateProfesorDto })
  @ApiResponse({ status: 201, description: 'Profesor creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createProfesorDto: CreateProfesorDto) {
    const data = await this.profesorService.create(createProfesorDto);
    return {
      success: true,
      message: 'Profesor creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Profesor' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Profesor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Profesor no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.profesorService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { profesor: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Profesors' })
  @ApiResponse({ status: 200, description: 'Lista de Profesors' })
  async findAll() {
    const data = await this.profesorService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Profesor por ID' })
  @ApiParam({ name: 'id', description: 'ID del Profesor' })
  @ApiResponse({ status: 200, description: 'Profesor encontrado' })
  @ApiResponse({ status: 404, description: 'Profesor no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.profesorService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Profesor' })
  @ApiParam({ name: 'id', description: 'ID del Profesor' })
  @ApiBody({ type: UpdateProfesorDto })
  @ApiResponse({ status: 200, description: 'Profesor actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Profesor no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateProfesorDto: UpdateProfesorDto
  ) {
    const data = await this.profesorService.update(id, updateProfesorDto);
    return {
      success: true,
      message: 'Profesor actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Profesor' })
  @ApiParam({ name: 'id', description: 'ID del Profesor' })
  @ApiResponse({ status: 200, description: 'Profesor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Profesor no encontrado' })
  async remove(@Param('id') id: string) {
    const profesor = await this.profesorService.findOne(id);
    if (profesor.imagen) {
      const filename = profesor.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.profesorService.remove(id);
    return { success: true, message: 'Profesor eliminado exitosamente' };
  }
}
