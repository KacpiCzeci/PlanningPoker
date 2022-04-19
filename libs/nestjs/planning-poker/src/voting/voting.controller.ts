import { Body, Controller, Get, Post } from '@nestjs/common';

export type Voting = {
  finished: boolean;
  participants: { name: string; score: number }[];
  onFinish: (() => void)[];
};

const voting: Voting = {
  finished: false,
  participants: [],
  onFinish: [],
};

class VoteDto {
  name: string;
  score: number;
}

@Controller('voting')
export class VotingController {
  @Get('finish')
  finish() {
    voting.onFinish.forEach((x) => x());
    voting.onFinish = [];
    voting.finished = true;
  }

  @Get('getResult')
  async getResult() {
    await new Promise<void>((res) => {
      voting.onFinish.push(res);
    });

    return voting.participants.map((p) => p.score);
  }

  @Post('vote')
  vote(@Body() data: VoteDto) {
    const participant = voting.participants.find((p) => p.name === data.name);
    if (participant === undefined) {
      voting.participants.push(data);
    } else {
      participant.score = data.score;
    }
    return 'ok';
  }
}
