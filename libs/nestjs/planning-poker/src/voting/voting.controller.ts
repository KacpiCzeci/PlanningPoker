import { DatastoreService } from './../datastore/datastore.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

export type Voting = {
  question: string;
  finished: boolean;
  participants: { name: string; score: number }[];
  onFinish: (() => void)[];
};

class VoteDto {
  name: string;
  score: number;
}

@Controller('voting')
export class VotingController {
  voting: Voting;
  constructor(private datastore: DatastoreService) {}

  @Get('finish')
  finish() {
    const voting = this.datastore.getBoard().currentVoting;
    voting.onFinish.forEach((x) => x());
    voting.onFinish = [];
    voting.finished = true;
  }

  @Get('getResult')
  async getResult() {
    const voting = this.datastore.getBoard().currentVoting;
    await new Promise<void>((res) => {
      voting.onFinish.push(res);
    });

    return voting.participants.map((p) => p.score);
  }

  @Post('vote')
  vote(@Body() data: VoteDto) {
    const voting = this.datastore.getBoard().currentVoting;
    const participant = voting.participants.find((p) => p.name === data.name);
    if (participant === undefined) {
      voting.participants.push(data);
    } else {
      participant.score = data.score;
    }
    return 'ok';
  }
}
