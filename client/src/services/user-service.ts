import { AxiosResponse } from 'axios/index';
import { User } from '../models/user';
import $api from '../http';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<User[]>> {
    return $api.get<User[]>('/users');
  }
}
