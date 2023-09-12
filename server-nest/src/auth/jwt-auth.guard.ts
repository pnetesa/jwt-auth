import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }

    const accessToken = authorizationHeader.split(' ').at(-1);
    if (!accessToken) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }

    const userData = this.tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }

    req.user = userData;
    return true;
  }
}
