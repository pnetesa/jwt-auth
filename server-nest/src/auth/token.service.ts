import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dto/token-dto';
import * as process from 'process';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Token } from '../models/token';
import { UserDto } from '../dto/user-dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
  ) {}

  public generateTokens(user: UserDto): TokenDto {
    const payload = {
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_MAX_AGE,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_MAX_AGE,
      }),
    };
  }

  public async saveToken(
    userId: ObjectId,
    refreshToken: string,
  ): Promise<Token> {
    const tokenData = await this.tokenModel.findOne({ user: userId }).exec();
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    const newTokenData = new this.tokenModel({ user: userId, refreshToken });
    return newTokenData.save();
  }

  public async removeToken(refreshToken: string): Promise<Token> {
    const tokenData = await this.tokenModel.findOne({ refreshToken }).exec();
    if (tokenData) {
      await tokenData.deleteOne();
    }
    return tokenData;
  }

  public validateAccessToken(accessToken: string): UserDto | null {
    try {
      return this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public validateRefreshToken(refreshToken: string): UserDto | null {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
