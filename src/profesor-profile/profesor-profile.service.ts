import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfesorProfile, ProfesorProfileDocument } from './schemas/profesor-profile.schema';
import { CreateProfesorProfileDto } from './dto/create-profesor-profile.dto';
import { UpdateProfesorProfileDto } from './dto/update-profesor-profile.dto';

@Injectable()
export class ProfesorProfileService {
  constructor(
    @InjectModel(ProfesorProfile.name) private profesorprofileModel: Model<ProfesorProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateProfesorProfileDto): Promise<ProfesorProfile> {
    const profile = await this.profesorprofileModel.create({
      user: userId,
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<ProfesorProfile | null> {
    return this.profesorprofileModel.findOne({ user: userId }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<ProfesorProfile[]> {
    return this.profesorprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateProfesorProfileDto): Promise<ProfesorProfile> {
    const profile = await this.profesorprofileModel.findOneAndUpdate(
      { user: userId },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.profesorprofileModel.deleteOne({ user: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}
