import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EstudianteDocument = Estudiante & Document;

@Schema({ timestamps: true })
export class Estudiante {
  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  curso?: string;

  @Prop({ enum: ['basico', 'medio'], default: 'basico' })
  nivel?: string;

  @Prop({ type: Types.ObjectId, ref: 'Colegio', required: true })
  colegio: Types.ObjectId;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const EstudianteSchema = SchemaFactory.createForClass(Estudiante);

EstudianteSchema.index({ email: 1 });
EstudianteSchema.index({ colegio: 1 });
EstudianteSchema.index({ nivel: 1 });
