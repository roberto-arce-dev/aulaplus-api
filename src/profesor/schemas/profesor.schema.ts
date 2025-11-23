import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProfesorDocument = Profesor & Document;

@Schema({ timestamps: true })
export class Profesor {
  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  asignatura?: string;

  @Prop({ type: Types.ObjectId, ref: 'Colegio', required: true })
  colegio: Types.ObjectId;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ProfesorSchema = SchemaFactory.createForClass(Profesor);

ProfesorSchema.index({ email: 1 });
ProfesorSchema.index({ colegio: 1 });
ProfesorSchema.index({ asignatura: 1 });
