import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user';
import { Model } from 'mongoose';
import { UserDto } from '../dto/user-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(
      ({ _id: id, email, isActivated }) =>
        new UserDto(`${id}`, email, isActivated),
    );
  }
}
