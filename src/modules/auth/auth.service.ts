/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPasswordValid', isPasswordValid);
    if (isPasswordValid) {
      return user;
    }
    return null;
  }

  login(user: any) {
    return this.authRefreshTokenService.generateTokenPair(user);
  }

  register(user: RegisterDTO) {
    const { email, password } = user;
    return this.usersService.create({
      email,
      password,
    });
  }
}
