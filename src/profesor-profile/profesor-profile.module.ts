import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfesorProfile, ProfesorProfileSchema } from './schemas/profesor-profile.schema';
import { ProfesorProfileService } from './profesor-profile.service';
import { ProfesorProfileController } from './profesor-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProfesorProfile.name, schema: ProfesorProfileSchema },
    ]),
  ],
  controllers: [ProfesorProfileController],
  providers: [ProfesorProfileService],
  exports: [ProfesorProfileService],
})
export class ProfesorProfileModule {}
