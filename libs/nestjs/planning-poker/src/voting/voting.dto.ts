import { ApiProperty } from '@nestjs/swagger';

export type Vote = { name: string; score: number };

export class VoteDto implements Vote {
  @ApiProperty()
  name: string;

  @ApiProperty()
  score: number;
}

export class GetResultSuccessDto {
  @ApiProperty({ type: [VoteDto] })
  scores: Vote[];
}

export class VotingDto {
  @ApiProperty()
  question: string;

  @ApiProperty()
  finished: boolean;

  @ApiProperty({ type: [VoteDto] })
  participants: Vote[];
}
