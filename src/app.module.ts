import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule } from './modules/crypto/crypto.module';

@Module({
  imports: [CryptoModule, UsersModule, AuthModule, ConfigModule.forRoot()],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
