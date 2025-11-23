import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CursoDocument = Curso & Document;

@Schema({ timestamps: true })
export class Curso {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Profesor', required: true })
  profesor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Colegio', required: true })
  colegio: Types.ObjectId;

  @Prop({ enum: ['basico', 'medio'], default: 'basico' })
  nivel?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Estudiante' }], default: [] })
  estudiantes?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const CursoSchema = SchemaFactory.createForClass(Curso);

CursoSchema.index({ profesor: 1 });
CursoSchema.index({ colegio: 1 });
CursoSchema.index({ nivel: 1 });
