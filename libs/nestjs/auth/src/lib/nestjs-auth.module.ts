import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [],
  imports: [AuthModule],
  exports: [],
})
export class NestjsAuthModule {}
