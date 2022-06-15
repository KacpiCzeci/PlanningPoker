import {
  NestjsAuthModule,
  UsersModule,
  UsersService,
} from '@planning-poker/nestjs/auth';
import { Module } from '@nestjs/common';
import { VotingController } from '../voting/voting.controller';

@Module({
  controllers: [VotingController],
  imports: [UsersModule],
  exports: [],
})
export class NestjsPlanningPokerModule {}
