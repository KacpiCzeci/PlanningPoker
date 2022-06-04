import { VotingWithCurrentIssue } from './voting.service';
import { Voting } from './voting.controller';
import { Issue } from './voting.dto';



export type VotingRequest = Request & {
  params: { roomID: string };
  votingUpdated: () => void;
  getVoting: () => Voting;
  getCurrentIssue: () => Issue
};
