import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfesorService } from './profesor.service';
import { ProfesorController } from './profesor.controller';
import { UploadModule } from '../upload/upload.module';
import { Profesor, ProfesorSchema } from './schemas/profesor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profesor.name, schema: ProfesorSchema }]),
    UploadModule,
  ],
  controllers: [ProfesorController],
  providers: [ProfesorService],
  exports: [ProfesorService],
})
export class ProfesorModule {}
