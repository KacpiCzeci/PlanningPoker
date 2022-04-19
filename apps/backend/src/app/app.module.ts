import { Module } from '@nestjs/common';
import { NestjsPlanningPokerModule } from '@planning-poker/nestjs/planning-poker';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [NestjsPlanningPokerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
