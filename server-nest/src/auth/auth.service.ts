import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCredsDto } from '../dto/user-creds-dto';
import { UserDto } from '../dto/user-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import * as process from 'process';
import { AuthDto } from '../dto/auth-dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenService: TokenService,
  ) {}

  public async register(userCredsDto: UserCredsDto): Promise<AuthDto> {
    const { email, password } = userCredsDto;
    const candidate = await this.userModel.findOne({ email }).exec();
    if (candidate) {
      throw new HttpException(
        { message: 'User already registered' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = parseInt(process.env.PASSWORD_SALT);
    const passwordHash = await bcrypt.hash(password, salt);
    const activationLink = uuid.v4();

    const createdUser = new this.userModel({
      email,
      password: passwordHash,
      isActivated: false,
      activationLink,
    });
    await createdUser.save();

    // Send activation email
    console.log(
      `Send activation email to ${email}, link: http://localhost:3000/api/activate/${activationLink}`,
    );

    const { id, isActivated } = createdUser;
    const userDto = new UserDto(id, email, isActivated);
    const tokens = this.tokenService.generateTokens(userDto);
    await this.tokenService.saveToken(id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  public async activate(activationLink: string): Promise<void> {
    const user = await this.userModel.findOne({ activationLink }).exec();
    if (!user) {
      throw new HttpException(
        { message: 'Invalid activation link' },
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isActivated = true;
    await user.save();
  }

  public async login(userCredsDto: UserCredsDto): Promise<AuthDto> {
    const { email, password } = userCredsDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        { message: 'User is not registered' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }

    const userDto = new UserDto(user.id, user.email, user.isActivated);
    const tokens = this.tokenService.generateTokens(userDto);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  public async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
  }

  public async refresh(refreshToken: string): Promise<AuthDto> {
    if (!refreshToken) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }

    const removedTokenData = await this.tokenService.removeToken(refreshToken);
    if (!removedTokenData) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }

    const user = await this.userModel.findById(removedTokenData.user).exec();
    const userDto = new UserDto(user.id, user.email, user.isActivated);
    const tokens = this.tokenService.generateTokens(userDto);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}
