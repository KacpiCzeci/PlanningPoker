import { Module } from '@nestjs/common';
import { NestjsAuthModule } from '@planning-poker/nestjs/auth';
import { NestjsPlanningPokerModule } from '@planning-poker/nestjs/planning-poker';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [NestjsPlanningPokerModule, NestjsAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
