import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string, includePassword = false) {
    const query = this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (includePassword) {
      query.select('+password');
    }

    return query;
  }

  async create(data: { name: string; email: string; password: string }) {
    return this.userModel.create(data);
  }
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
