import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [UsersService],
})
export class UsersModule {}
