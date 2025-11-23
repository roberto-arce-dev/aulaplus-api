import { PartialType } from '@nestjs/swagger';
import { CreateProfesorProfileDto } from './create-profesor-profile.dto';

export class UpdateProfesorProfileDto extends PartialType(CreateProfesorProfileDto) {}
