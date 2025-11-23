import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColegioService } from './colegio.service';
import { ColegioController } from './colegio.controller';
import { UploadModule } from '../upload/upload.module';
import { Colegio, ColegioSchema } from './schemas/colegio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Colegio.name, schema: ColegioSchema }]),
    UploadModule,
  ],
  controllers: [ColegioController],
  providers: [ColegioService],
  exports: [ColegioService],
})
export class ColegioModule {}
