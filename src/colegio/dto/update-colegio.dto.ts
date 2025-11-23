import { PartialType } from '@nestjs/swagger';
import { CreateColegioDto } from './create-colegio.dto';

export class UpdateColegioDto extends PartialType(CreateColegioDto) {}
