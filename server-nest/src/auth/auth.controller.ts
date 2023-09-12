import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UserCredsDto } from '../dto/user-creds-dto';
import { AuthService } from './auth.service';
import { AuthDto } from '../dto/auth-dto';
import * as process from 'process';
import { Request, Response } from 'express';
import { ValidationPipe } from '../pipes/validation.pipe';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/registration')
  async register(
    @Body() userCredsDto: UserCredsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthDto> {
    const authDto = await this.authService.register(userCredsDto);
    res.cookie(REFRESH_TOKEN_KEY, authDto.refreshToken, {
      // secure: true, // for HTTPS
      httpOnly: true,
      maxAge: this.getRefreshTokenMaxAge(),
    });
    return authDto;
  }

  @Redirect()
  @Get('/activate/:link')
  async activate(
    @Param('link') activationLink: string,
  ): Promise<{ url: string }> {
    await this.authService.activate(activationLink);
    return { url: process.env.CLIENT_URL };
  }

  @UsePipes(ValidationPipe)
  @Post('/login')
  async login(
    @Body() userCredsDto: UserCredsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthDto> {
    const authDto = await this.authService.login(userCredsDto);
    res.cookie(REFRESH_TOKEN_KEY, authDto.refreshToken, {
      // secure: true, // for HTTPS
      httpOnly: true,
      maxAge: this.getRefreshTokenMaxAge(),
    });
    return authDto;
  }

  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    await this.authService.logout(refreshToken);
    res.clearCookie(REFRESH_TOKEN_KEY);
    return { message: 'Logged Out' };
  }

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthDto> {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    const authDto = await this.authService.refresh(refreshToken);
    res.cookie(REFRESH_TOKEN_KEY, authDto.refreshToken, {
      // secure: true, // for HTTPS
      httpOnly: true,
      maxAge: this.getRefreshTokenMaxAge(),
    });
    return authDto;
  }

  private getRefreshTokenMaxAge(): number {
    const days = parseInt(
      process.env.REFRESH_TOKEN_MAX_AGE.substring(
        0,
        process.env.REFRESH_TOKEN_MAX_AGE.length - 1,
      ),
    );
    return days * 24 * 60 * 60 * 1000;
  }
}
