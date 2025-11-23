import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type ProfesorProfileDocument = ProfesorProfile & Document;

/**
 * ProfesorProfile - Profile de negocio para rol PROFESOR
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class ProfesorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreCompleto: string;

  @Prop()
  telefono?: string;

  @Prop()
  especialidad?: string;

  @Prop({ type: [String], default: [] })
  grados?: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProfesorProfileSchema = SchemaFactory.createForClass(ProfesorProfile);

// Indexes para optimizar queries
ProfesorProfileSchema.index({ user: 1 });
