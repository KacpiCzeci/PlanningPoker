import { DatastoreService } from './../datastore/datastore.service';
import { Module } from '@nestjs/common';
import { BoardController } from '../board/board.controller';
import { VotingController } from '../voting/voting.controller';

@Module({
  controllers: [VotingController, BoardController],
  providers: [DatastoreService],
  exports: [],
})
export class NestjsPlanningPokerModule {}
