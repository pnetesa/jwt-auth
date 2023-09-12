import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDto } from '../dto/user-dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<UserDto[]> {
    return await this.usersService.getAllUsers();
  }
}
