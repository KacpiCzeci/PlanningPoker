import { ApiProperty } from '@nestjs/swagger';

export type Player = { player: string; score: number };

export class PlayerDto implements Player {
  @ApiProperty()
  player: string;

  @ApiProperty({required: false})
  score: number | undefined;
}

export class GetResultSuccessDto {
  @ApiProperty()
  gameName: string;

  @ApiProperty({ type: [PlayerDto] })
  players: Player[];
}
