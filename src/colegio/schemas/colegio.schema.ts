import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ColegioDocument = Colegio & Document;

@Schema({ timestamps: true })
export class Colegio {
  @Prop({ unique: true })
  nombre: string;

  @Prop()
  direccion?: string;

  @Prop()
  telefono?: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  logo?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ColegioSchema = SchemaFactory.createForClass(Colegio);

ColegioSchema.index({ email: 1 });
ColegioSchema.index({ nombre: 1 });
