import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export type Issue = {
  finished: boolean;
  gameName: string;
  players: { player: string; score: number|null }[];
  tasks: string[];
  id: string;
  current: boolean;
};

export type Player = { player: string; score: number | null };

export class PlayerDto implements Player {
  @ApiProperty()
  player: string;

  @ApiProperty({ nullable: true })
  score: number | null;
}

export class IssueDto implements Issue {
  @ApiProperty()
  finished: boolean;

  @ApiProperty()
  gameName: string;

  @ApiProperty({ type: [PlayerDto] })
  players: Player[];

  @ApiProperty()
  tasks: string[];

  @ApiProperty()
  current: boolean;

  @ApiProperty()
  id: string;
}

export const IssuesSlim = OmitType(IssueDto, ['current']);
export class GetResultSuccessDto extends IssuesSlim {
  @ApiProperty({ type: [IssueDto] })
  issues: Issue[];
}

export class SetIssuesBody {
  @ApiProperty({ type: [IssueDto] })
  issues: Issue[];
}

export class SetCurrentIssueBody {
  @ApiProperty()
  id: string;
}
