import { DatastoreService } from './../datastore/datastore.service';
import { Module } from '@nestjs/common';
import { VotingController } from '../voting/voting.controller';

@Module({
  controllers: [VotingController],
  providers: [DatastoreService],
  exports: [],
})
export class NestjsPlanningPokerModule {}
