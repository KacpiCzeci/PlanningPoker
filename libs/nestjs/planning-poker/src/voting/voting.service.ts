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

const votings: Record<string, Voting> = {};

@Injectable()
export class VotingRoomInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<VotingRequest>();
    const voting = (function getCurrentVotingOrCreate() {
      if (votings[req.params.roomID]) return votings[req.params.roomID];
      else {
        votings[req.params.roomID] = {
          finished: false,
          onFinish: [],
          participants: [],
          question: '',
        };
        return votings[req.params.roomID]
      }
    })();

    // const metaValue = this.reflector.get('SomeAnnotedDecorator', context.getHandler());
    req.votingUpdated = () => {
      console.log('Updated');
      voting.onFinish.forEach((x) => x());
      voting.onFinish = [];
    };

    req.getVoting = () => voting;

    return next.handle();
  }
}

// export class VotingService{
//       constructor(@Inject(REQUEST) private request) {}
// }