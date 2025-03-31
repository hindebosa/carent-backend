import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsUserAlreadyExist } from './validators/is-user-already-exists.validator';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [PrismaModule, CryptoModule],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExist],
  exports: [UsersService],
})
export class UsersModule {}
