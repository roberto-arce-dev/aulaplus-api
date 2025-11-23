import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateColegioDto } from './dto/create-colegio.dto';
import { UpdateColegioDto } from './dto/update-colegio.dto';
import { Colegio, ColegioDocument } from './schemas/colegio.schema';

@Injectable()
export class ColegioService {
  constructor(
    @InjectModel(Colegio.name) private colegioModel: Model<ColegioDocument>,
  ) {}

  async create(createColegioDto: CreateColegioDto): Promise<Colegio> {
    const nuevoColegio = await this.colegioModel.create(createColegioDto);
    return nuevoColegio;
  }

  async findAll(): Promise<Colegio[]> {
    const colegios = await this.colegioModel.find();
    return colegios;
  }

  async findOne(id: string | number): Promise<Colegio> {
    const colegio = await this.colegioModel.findById(id);
    if (!colegio) {
      throw new NotFoundException(`Colegio con ID ${id} no encontrado`);
    }
    return colegio;
  }

  async update(id: string | number, updateColegioDto: UpdateColegioDto): Promise<Colegio> {
    const colegio = await this.colegioModel.findByIdAndUpdate(id, updateColegioDto, { new: true });
    if (!colegio) {
      throw new NotFoundException(`Colegio con ID ${id} no encontrado`);
    }
    return colegio;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.colegioModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Colegio con ID ${id} no encontrado`);
    }
  }
}
