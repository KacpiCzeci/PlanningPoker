import { AuthGuard } from '@nestjs/passport';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  PlayerDto,
  GetResultSuccessDto,
  IssueDto,
  SetIssuesBody,
  SetCurrentIssueBody,
  Issue,
} from './voting.dto';
import {
  ApiConflictResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { sha1 } from 'object-hash';

import { VotingRoomInterceptor } from './voting.service';
import { VotingRequest } from './voting.request';
import { UsersService } from '@planning-poker/nestjs/auth';

export const calculateEtag = (voting: GetResultSuccessDto) => {
  return sha1({
    ...voting,
  });
};

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
  constructor(private users: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/startNew')
  async startNew(
    @Body() { name }: RestartRequest,
    @Param('roomID') room: string,
    @Req() req: VotingRequest & { user: any }
  ) {
    const user = await this.users.findId(req.user.userId);
    user?.roomsCreated.add(room);
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
        req.getCurrentIssue()?.players.map((x) => ({
          player: x.player,
          score: x.score,
        })) ?? [];

      const result: GetResultSuccessDto = {
        ...currentIssue,
        issues: [...req.getVoting().issues],
      };
      return [
        result,
        function update() {
          result.gameName = req.getCurrentIssue()?.gameName ?? '';
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
  @UseGuards(AuthGuard('jwt'))
  async vote(
    @Body() { player, score }: PlayerDto,
    @Param('roomID') room: string,
    @Req() req: VotingRequest & { user: any }
  ) {
    const user = await this.users.findId(req.user.userId);
    user?.rooms.add(room);
    const voting = req.getVoting();
    const currentIssue = req.getCurrentIssue();

    const participant = currentIssue.players.find((p) => p.player === player);
    if (participant === undefined) {
      currentIssue.players.push({ player, score });
    } else {
      participant.score = score;
    }

    if (currentIssue.players.every((x) => x.score != null)) {
      const storyPoints = calculateStoryPoints(currentIssue);
      currentIssue.storyPoints = storyPoints;
    }

    req.votingUpdated();

    return 'ok';
  }

  @Post('finish')
  finish(@Param('roomID') room: string, @Req() req: VotingRequest) {
    const voting = req.getVoting();
    const currentIssue = req.getCurrentIssue();
    currentIssue.finished = true;
    currentIssue.storyPoints = calculateStoryPoints(currentIssue);
    req.votingUpdated();

    return 'ok';
  }

  @Post('resume')
  resume(@Param('roomID') room: string, @Req() req: VotingRequest) {
    const currentIssue = req.getCurrentIssue();
    currentIssue.finished = false;
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
    if (issues.length > 0) {
      voting.issues = issues;
      if (issues.every((x) => x.current === false)) {
        issues[0].current = true;
        voting.currentIssueId = issues[0].id;
      }
      req.votingUpdated();
    }

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

function calculateStoryPoints<
  T extends { players: PlayerDto[]; finished: boolean }
>(issue: T): number {
  let len = 0;
  for (let i = 0; i < issue.players.length; i++) {
    if (issue.players[i].score !== null) len += 1;
  }
  const average =
    issue.players
      .map((x) => x.score)
      .filter((x): x is number => x !== null)
      .reduce<number>(
        (prevValue, currentValue) => Number(prevValue) + Number(currentValue),
        0
      ) / len;

  if (average <= 89) {
    const cardsValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const goal = Math.round(average);
    const closest = cardsValues.reduce(function (prev, curr) {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });

    return closest;
  } else {
    return 100;
  }
}
