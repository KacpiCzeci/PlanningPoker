import { Voting } from './voting.controller';

export type VotingRequest = Request & {
  params: { roomID: string };
  votingUpdated: () => void;
  getVoting: () => Voting;
};
