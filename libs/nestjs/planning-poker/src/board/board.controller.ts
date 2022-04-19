import { VoteDto, VotingDto } from './../voting/voting.dto';
import { BoardDto, CreateVotingDto } from './board.dto';
import { DatastoreService } from './../datastore/datastore.service';
import { Voting } from './../voting/voting.controller';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export type Board = {
  players: string[];
  votings: Voting[];
  name: string;
  currentVoting: Voting | undefined;
};

let onNewVoting: Array<() => void> = [];

@Controller('board')
export class BoardController {
  board: Board;
  constructor(private datastore: DatastoreService) {
    this.board = datastore.getBoard();
  }

  @Get()
  @ApiOkResponse({ type: BoardDto })
  getBoard() {
    return this.board;
  }

  @Post('newVoting')
  newVoting(@Body() data: CreateVotingDto) {
    this.board.currentVoting = {
      finished: false,
      onFinish: [],
      participants: [],
      question: data.name,
    };

    onNewVoting.forEach((x) => x());
    onNewVoting = [];

    return 'ok';
  }

  @Get('nextVoting')
  @ApiOkResponse({ type: VotingDto })
  async getNextVoting(): Promise<VotingDto> {
    await new Promise<void>((res) => onNewVoting.push(res));
    return this.board.currentVoting;
  }
}
