import { Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './dto/user-dto';
import { UserService } from './services/user-service';

@Controller('/api')
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  register(): any {
    return { message: 'Not Implemented Yet' };
  }

  @Get('/activate')
  activate(): any {
    return { message: 'Not Implemented Yet' };
  }

  @Post('/login')
  login(): any {
    return { message: 'Not Implemented Yet' };
  }

  @Post('/logout')
  logout(): any {
    return { message: 'Not Implemented Yet' };
  }

  @Get('/refresh')
  refresh(): any {
    return { message: 'Not Implemented Yet' };
  }

  @Get('/users')
  async getUsers(): Promise<UserDto[]> {
    return await this.userService.getUsers();
  }
}
