import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso, CursoDocument } from './schemas/curso.schema';

@Injectable()
export class CursoService {
  constructor(
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const nuevoCurso = await this.cursoModel.create(createCursoDto);
    return nuevoCurso;
  }

  async findAll(): Promise<Curso[]> {
    const cursos = await this.cursoModel.find().populate('profesor', 'nombre especialidad');
    return cursos;
  }

  async findOne(id: string | number): Promise<Curso> {
    const curso = await this.cursoModel.findById(id)
      .populate('profesor', 'nombre asignatura')
      .populate('colegio', 'nombre');
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  async update(id: string | number, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    const curso = await this.cursoModel.findByIdAndUpdate(id, updateCursoDto, { new: true }).populate('profesor', 'nombre especialidad')
    .populate('colegio', 'nombre');
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.cursoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
  }
}
