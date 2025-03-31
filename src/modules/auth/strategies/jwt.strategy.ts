import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../config/env/configuration';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UsersService;

  constructor(
    userService: UsersService,
    configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
    this.userService = userService;
  }

  async validate(payload: any): Promise<any | null> {
    const authUser = await this.userService.findOne(payload.sub);
    if (!authUser) {
      throw new UnauthorizedException();
    }

    return authUser;
  }
}
