import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { VotingRequest } from "./voting.request";

export const roomID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<VotingRequest>();

    return {
      update: () => {
        0;
      },
    };
  }
);
