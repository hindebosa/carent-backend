import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}
  async create(data: any) {
    const { email, password } = data;

    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new Error('User already exists');
    }
    // Hash the password before saving it to the database

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: await this.cryptoService.generateHash(password),
      },
    });
    return user;
  }

  async findOne(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }
}
