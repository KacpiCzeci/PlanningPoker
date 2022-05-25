import { Module } from '@nestjs/common';
import { VotingController } from '../voting/voting.controller';

@Module({
  controllers: [VotingController],
  exports: [],
})
export class NestjsPlanningPokerModule {}
