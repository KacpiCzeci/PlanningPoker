import { Module } from '@nestjs/common';
import { VotingController } from '../voting/voting.controller';

@Module({
  controllers: [VotingController],
  providers: [],
  exports: [],
})
export class NestjsPlanningPokerModule {}
