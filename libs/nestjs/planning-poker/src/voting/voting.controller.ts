import { roomID } from './roomID.decorator';
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
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PlayerDto, GetResultSuccessDto } from './voting.dto';
import {
  ApiConflictResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { calculateEtag } from '@planning-poker/shared/backend-api-client';
import { VotingRoomInterceptor } from './voting.service';
import { VotingRequest } from './voting.request';

export type Voting = {
  question: string;
  finished: boolean;
  participants: { name: string; score: number }[];
  onFinish: (() => void)[];
};

export class RestartRequest {
  @ApiProperty()
  name: string;
}

export class GetResultRequest {
  @ApiProperty({ required: false })
  etag?: string;
}

@UseInterceptors(new VotingRoomInterceptor())
@Controller('voting/:roomID')
export class VotingController {
  constructor(private datastore: DatastoreService) {
    console.log('Create');
  }

  private getCurrentVoting(@Param('roomID') roomID) {
    return this.datastore.getCurrentVoting();
  }

  @Post('/startNew')
  startNew(
    @Body() { name }: RestartRequest,
    @Param('roomID') room: string,
    @Req() req: VotingRequest
  ) {
    const voting = req.getVoting();

    console.log({ req });
    // room.update();
    voting.question = name;
    voting.participants = [];
    req.votingUpdated();
  }

  @Get('getResult')
  @ApiOkResponse({ type: GetResultSuccessDto })
  @ApiConflictResponse({ description: 'Error when voting not started' })
  async getResult(
    @Param('roomID') room: string,
    @Req() req: VotingRequest,
    @Query() { etag }: GetResultRequest
  ): Promise<GetResultSuccessDto> {
    const voting = req.getVoting();

    if (voting.question === '') {
      throw new HttpException('voting is not started', 409);
    }

    const waitForUpdate = () =>
      new Promise<void>((res) => voting.onFinish.push(res));

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
    result.etag = calculateEtag(result);

    return { ...result };
  }

  @Post('vote')
  vote(
    @Body() { player, score }: PlayerDto,
    @Param('roomID') room: string,
    @Req() req: VotingRequest
  ) {
    const voting = req.getVoting();
    const participant = voting.participants.find((p) => p.name === player);
    if (participant === undefined) {
      voting.participants.push({ name: player, score });
    } else {
      participant.score = score;
    }

    req.votingUpdated();

    return 'ok';
  }
}
