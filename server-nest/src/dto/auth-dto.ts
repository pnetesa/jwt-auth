import { UserDto } from './user-dto';
import { TokenDto } from './token-dto';

export interface AuthDto extends TokenDto {
  user: UserDto;
}
