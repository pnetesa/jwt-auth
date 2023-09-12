import { IsEmail, IsString, Length } from 'class-validator';

export class UserCredsDto {
  @IsString({ message: 'expected to be of a String type' })
  @IsEmail({}, { message: 'invalid email' })
  readonly email: string;

  @IsString({ message: 'expected to be of a String type' })
  @Length(4, 16, { message: 'should have 4 to 16 length' })
  readonly password: string;
}
