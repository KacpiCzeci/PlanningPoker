import { Issue } from '@planning-poker/shared/interfaces';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export type Player = { player: string; score: number };

export class PlayerDto implements Player {
  @ApiProperty()
  player: string;

  @ApiProperty({ required: false })
  score: number | undefined;
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
}

export class GetResultSuccessDto extends IssueDto {
  @ApiProperty({ type: [IssueDto] })
  issues: Issue[];
}

export class SetIssuesBody {
  @ApiProperty({ type: [IssueDto] })
  issues: Issue[];
}

export class SetCurrentIssueBody {
  @ApiProperty()
  id: number;
}
