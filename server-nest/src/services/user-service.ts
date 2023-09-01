import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user-dto';
import { User } from '../models/user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(
      ({ _id: id, email, isActivated }) =>
        new UserDto(`${id}`, email, isActivated));
  }
}
