import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { Token, TokenSchema } from '../models/token';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
