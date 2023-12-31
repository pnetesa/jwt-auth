import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ isRequired: true })
  email: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop()
  isActivated: boolean;

  @Prop()
  activationLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
