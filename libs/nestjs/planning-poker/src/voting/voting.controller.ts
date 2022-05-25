import { roomID } from './roomID.decorator';
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
import {
  PlayerDto,
  GetResultSuccessDto,
  IssueDto,
  SetIssuesBody,
  SetCurrentIssueBody,
} from './voting.dto';
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
import { Issue } from '@planning-poker/shared/interfaces';

export type Voting = {
  onFinishCurrentIssue: (() => void)[];
  currentIssueId: string | undefined;
  issues: Issue[];
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
  @Post('/startNew')
  startNew(
    @Body() { name }: RestartRequest,
    @Param('roomID') room: string,
    @Req() req: VotingRequest
  ) {
    const voting = req.getVoting();

    const currentIssue = req.getCurrentIssue();
    console.log({ req });
    // room.update();
    if (currentIssue) {
      currentIssue.gameName = name;
      currentIssue.players = [];
      req.votingUpdated();
    }
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
    const currentIssue = req.getCurrentIssue();
    const waitForUpdate = () =>
      new Promise<void>((res) => voting.onFinishCurrentIssue.push(res));

    const [result, update] = ((): [GetResultSuccessDto, () => void] => {
      const mapPlayers = () =>
        req.getCurrentIssue().players.map((x) => ({
          player: x.player,
          score: x.score,
        }));
      const result: GetResultSuccessDto = {
        ...currentIssue,
        issues: [...req.getVoting().issues],
      };
      return [
        result,
        function update() {
          result.gameName = req.getCurrentIssue().gameName;
          result.players = mapPlayers();
          result.issues = req.getVoting().issues;
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
    const currentIssue = req.getCurrentIssue();
    const participant = currentIssue.players.find((p) => p.player === player);
    if (participant === undefined) {
      currentIssue.players.push({ player, score });
    } else {
      participant.score = score;
    }

    req.votingUpdated();

    return 'ok';
  }

  @Post('finish')
  finish(@Param('roomID') room: string, @Req() req: VotingRequest) {
    const voting = req.getVoting();
    const currentIssue = req.getCurrentIssue();
    currentIssue.finished = true;
    req.votingUpdated();

    return 'ok';
  }

  @Post('setIssues')
  setIssues(
    @Body() { issues }: SetIssuesBody,
    @Param('roomID') room: string,
    @Req() req: VotingRequest
  ) {
    const voting = req.getVoting();
    voting.issues = issues;
    req.votingUpdated();

    return 'ok';
  }

  @Post('setCurrentIssue')
  setCurrentIssue(
    @Body() { id }: SetCurrentIssueBody,
    @Param('roomID') room: string,
    @Req() req: VotingRequest
  ) {
    const voting = req.getVoting();
    voting.currentIssueId = id;
    req.votingUpdated();

    return 'ok';
  }
}
