import { Board } from './../board/board.controller';
import { Injectable } from '@nestjs/common';

const board: Board = {
  currentVoting: undefined,
  name: '',
  players: [],
  votings: [],
};

@Injectable()
export class DatastoreService {
  getBoard(): Board {
    return board;
  }
}
