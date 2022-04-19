import { VoteDto, VotingDto } from './../voting/voting.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Voting } from '../voting/voting.controller';

export class BoardDto {
  @ApiProperty({ type: [String] })
  players: string[];

  @ApiProperty({ type: [VotingDto] })
  votings: Voting[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  currentVoting: Voting | undefined;
}

export class CreateVotingDto {
  @ApiProperty()
  name: string;
}
