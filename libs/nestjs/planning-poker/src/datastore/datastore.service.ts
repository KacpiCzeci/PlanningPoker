import { Voting } from './../voting/voting.controller';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatastoreService {
  private voting: Voting = {
    finished: false,
    onFinish: [],
    participants: [],
    question: '',
  };
  getCurrentVoting(): Voting {
    return this.voting;
  }
}
