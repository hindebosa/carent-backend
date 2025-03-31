import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService, // Inject PrismaService
  ) {}

  async generateRefreshToken(
    authUserId: string,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: '3d',
      },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (
        await this.isRefreshTokenBlackListed(currentRefreshToken, authUserId)
      ) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      await this.prisma.authRefreshToken.create({
        data: {
          refreshToken: currentRefreshToken,
          expiresAt: currentRefreshTokenExpiresAt,
          userId: authUserId,
        },
      });
    }

    return newRefreshToken;
  }

  private async isRefreshTokenBlackListed(
    refreshToken: string,
    userId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = await this.prisma.authRefreshToken.findFirst({
      where: { refreshToken, userId },
    });
    return !!token;
  }

  async generateTokenPair(
    user: User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
      refresh_token: await this.generateRefreshToken(
        user.id,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.prisma.authRefreshToken.deleteMany({
      where: {
        expiresAt: { lte: new Date() },
      },
    });
  }
}
