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
import { ColegioService } from './colegio.service';
import { CreateColegioDto } from './dto/create-colegio.dto';
import { UpdateColegioDto } from './dto/update-colegio.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Colegio')
@ApiBearerAuth('JWT-auth')
@Controller('colegio')
export class ColegioController {
  constructor(
    private readonly colegioService: ColegioService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Colegio' })
  @ApiBody({ type: CreateColegioDto })
  @ApiResponse({ status: 201, description: 'Colegio creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createColegioDto: CreateColegioDto) {
    const data = await this.colegioService.create(createColegioDto);
    return {
      success: true,
      message: 'Colegio creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Colegio' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Colegio' })
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
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
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
    const updated = await this.colegioService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { colegio: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Colegios' })
  @ApiResponse({ status: 200, description: 'Lista de Colegios' })
  async findAll() {
    const data = await this.colegioService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Colegio por ID' })
  @ApiParam({ name: 'id', description: 'ID del Colegio' })
  @ApiResponse({ status: 200, description: 'Colegio encontrado' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.colegioService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Colegio' })
  @ApiParam({ name: 'id', description: 'ID del Colegio' })
  @ApiBody({ type: UpdateColegioDto })
  @ApiResponse({ status: 200, description: 'Colegio actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateColegioDto: UpdateColegioDto
  ) {
    const data = await this.colegioService.update(id, updateColegioDto);
    return {
      success: true,
      message: 'Colegio actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Colegio' })
  @ApiParam({ name: 'id', description: 'ID del Colegio' })
  @ApiResponse({ status: 200, description: 'Colegio eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  async remove(@Param('id') id: string) {
    const colegio = await this.colegioService.findOne(id);
    if (colegio.imagen) {
      const filename = colegio.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.colegioService.remove(id);
    return { success: true, message: 'Colegio eliminado exitosamente' };
  }
}
