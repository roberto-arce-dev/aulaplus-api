import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvaluacionDocument = Evaluacion & Document;

@Schema({ timestamps: true })
export class Evaluacion {
  @Prop({ type: Types.ObjectId, ref: 'Curso', required: true })
  curso: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Estudiante', required: true })
  estudiante: Types.ObjectId;

  @Prop({ min: 1.0, max: 7.0 })
  nota: number;

  @Prop({ default: Date.now })
  fecha?: Date;

  @Prop({ enum: ['prueba', 'examen', 'trabajo', 'tarea'], default: 'prueba' })
  tipo?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const EvaluacionSchema = SchemaFactory.createForClass(Evaluacion);

EvaluacionSchema.index({ curso: 1 });
EvaluacionSchema.index({ estudiante: 1 });
EvaluacionSchema.index({ fecha: -1 });
