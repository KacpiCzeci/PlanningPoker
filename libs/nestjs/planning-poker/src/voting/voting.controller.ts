import { DatastoreService } from './../datastore/datastore.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PlayerDto, GetResultSuccessDto } from './voting.dto';
import {
  ApiConflictResponse,
  ApiHeader,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { calculateEtag } from '@planning-poker/shared/backend-api-client';

export type Voting = {
  question: string;
  finished: boolean;
  participants: { name: string; score: number }[];
  onFinish: (() => void)[];
};

let updateCB: (() => void)[] = [];

export class RestartRequest {
  @ApiProperty()
  name: string;
}

export class GetResultRequest {
  @ApiProperty({ required: false })
  etag?: string;
}

@Controller('voting')
export class VotingController {
  voting: Voting;
  constructor(private datastore: DatastoreService) {
    console.log('Create');
  }

  @Post('startNew')
  startNew(@Body() { name }: RestartRequest) {
    const voting = this.datastore.getCurrentVoting();
    voting.question = name;

    voting.participants = [];
    updateCB.forEach((x) => x());
    updateCB = [];
  }

  @Get('getResult')
  @ApiOkResponse({ type: GetResultSuccessDto })
  @ApiConflictResponse({ description: 'Error when voting not started' })
  async getResult(
    @Query() {etag}: GetResultRequest
  ): Promise<GetResultSuccessDto> {
    const voting = this.datastore.getCurrentVoting();

    if (voting.question === '') {
      throw new HttpException('voting is not started', 409);
    }

    const waitForUpdate = () => new Promise<void>((res) => updateCB.push(res));

    const [result, update] = ((): [GetResultSuccessDto, () => void] => {
      const mapPlayers = () =>
        voting.participants.map((x) => ({
          player: x.name,
          score: x.score,
        }));
      const result = {
        gameName: voting.question,
        players: mapPlayers(),
      };
      return [
        result,
        () => {
          (result.gameName = voting.question), (result.players = mapPlayers());
        },
      ];
    })();

    if (etag !== undefined) {
      while (etag === calculateEtag(result)) {
        await waitForUpdate();
        update();
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    result.etag = calculateEtag(result)

    return {...result};
  }

  @Post('vote')
  vote(@Body() { player, score }: PlayerDto) {
    const voting = this.datastore.getCurrentVoting();
    const participant = voting.participants.find((p) => p.name === player);
    if (participant === undefined) {
      voting.participants.push({ name: player, score });
    } else {
      participant.score = score;
    }
    updateCB.forEach((x) => x());
    updateCB = [];
    return 'ok';
  }
}
