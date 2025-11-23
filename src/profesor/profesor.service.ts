import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { Profesor, ProfesorDocument } from './schemas/profesor.schema';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectModel(Profesor.name) private profesorModel: Model<ProfesorDocument>,
  ) {}

  async create(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
    const nuevoProfesor = await this.profesorModel.create(createProfesorDto);
    return nuevoProfesor;
  }

  async findAll(): Promise<Profesor[]> {
    const profesors = await this.profesorModel.find().populate('usuario', 'nombre email');
    return profesors;
  }

  async findOne(id: string | number): Promise<Profesor> {
    const profesor = await this.profesorModel.findById(id).populate('usuario', 'nombre email');
    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return profesor;
  }

  async update(id: string | number, updateProfesorDto: UpdateProfesorDto): Promise<Profesor> {
    const profesor = await this.profesorModel.findByIdAndUpdate(id, updateProfesorDto, { new: true }).populate('usuario', 'nombre email')
    .populate('colegio', 'nombre direccion');
    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return profesor;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.profesorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
  }
}
