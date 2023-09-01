import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user-service';
import { User, UserSchema } from './models/user';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://VERY-SECRET-URI.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AppController],
  providers: [UserService],
})
export class AppModule {}
