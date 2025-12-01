import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { Evaluacion, EvaluacionDocument } from './schemas/evaluacion.schema';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectModel(Evaluacion.name) private evaluacionModel: Model<EvaluacionDocument>,
  ) {}

  async create(createEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
    // This method might need adjustment or be replaced by registrarNotas for full functionality
    // For now, we assume CreateEvaluacionDto might be updated or used differently
    // Creating a basic evaluation without notes if DTO is generic
    const nuevoEvaluacion = await this.evaluacionModel.create(createEvaluacionDto);
    return nuevoEvaluacion;
  }

  async findAll(): Promise<Evaluacion[]> {
    const evaluacions = await this.evaluacionModel.find();
    return evaluacions;
  }

  async findOne(id: string | number): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionModel.findById(id)
    .populate('curso', 'nombre nivel')
    .populate('notas.estudiante', 'nombre email');
    if (!evaluacion) {
      throw new NotFoundException(`Evaluacion con ID ${id} no encontrado`);
    }
    return evaluacion;
  }

  async update(id: string | number, updateEvaluacionDto: UpdateEvaluacionDto): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionModel.findByIdAndUpdate(id, updateEvaluacionDto, { new: true })
    .populate('curso', 'nombre nivel')
    .populate('notas.estudiante', 'nombre email');
    if (!evaluacion) {
      throw new NotFoundException(`Evaluacion con ID ${id} no encontrado`);
    }
    return evaluacion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.evaluacionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Evaluacion con ID ${id} no encontrado`);
    }
  }

  async findByCurso(cursoId: string): Promise<Evaluacion[]> {
    return this.evaluacionModel.find({ curso: new Types.ObjectId(cursoId) })
      .populate('notas.estudiante', 'nombre email');
  }

  async findByEstudiante(estudianteId: string): Promise<Evaluacion[]> {
    // Find evaluations where the student has a grade
    return this.evaluacionModel.find({ 'notas.estudiante': new Types.ObjectId(estudianteId) })
      .populate('curso', 'nombre nivel')
      // We might want to filter the 'notas' array in the response to only show this student's note,
      // but returning the whole assessment is also valid.
      .populate('notas.estudiante', 'nombre email');
  }

  async registrarNotas(evaluacionDto: {
    cursoId: string;
    profesorId: string; // Unused in schema currently, but could be verified
    titulo: string;
    notas: Array<{ estudianteId: string; nota: number; observaciones?: string }>;
  }): Promise<Evaluacion> {
    const notasFormatted = evaluacionDto.notas.map(n => ({
      estudiante: new Types.ObjectId(n.estudianteId),
      nota: n.nota,
      observaciones: n.observaciones
    }));

    const nuevaEvaluacion = await this.evaluacionModel.create({
      curso: new Types.ObjectId(evaluacionDto.cursoId),
      titulo: evaluacionDto.titulo,
      notas: notasFormatted
    });
    return nuevaEvaluacion;
  }
}
