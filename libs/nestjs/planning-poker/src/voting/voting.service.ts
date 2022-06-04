import { Voting } from './voting.controller';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Req,
  Request,
} from '@nestjs/common';
import { VotingRequest } from './voting.request';
import { Issue } from './voting.dto';

export type VotingWithCurrentIssue = Voting & {
  readonly currentIssue: Issue;
};

const votings: Record<string, Voting> = {};

@Injectable()
export class VotingRoomInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<VotingRequest>();
    const voting = (function getCurrentVotingOrCreate() {
      if (votings[req.params.roomID]) return votings[req.params.roomID];
      else {
        votings[req.params.roomID] = {
          onFinishCurrentIssue: [],
          currentIssueId: 'default',
          issues: [
            {
              id: 'default',
              current: true,
              gameName: 'Question1',
              finished: false,
              players: [],
              tasks: [],
            },
          ],
        };
        return votings[req.params.roomID];
      }
    })();

    // const metaValue = this.reflector.get('SomeAnnotedDecorator', context.getHandler());
    req.votingUpdated = () => {
      console.log('Updated');
      voting.onFinishCurrentIssue.forEach((x) => x());
      voting.onFinishCurrentIssue = [];
    };

    req.getVoting = () => voting;
    req.getCurrentIssue = () => voting.issues.find( i => i.id === voting.currentIssueId)!

    return next.handle();
  }
}

// export class VotingService{
//       constructor(@Inject(REQUEST) private request) {}
// }
