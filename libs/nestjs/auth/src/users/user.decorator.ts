import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { UsersService } from './users.service';

export const User = createParamDecorator(

  (data: unknown, ctx: ExecutionContext) => {
        const injectYourService = Inject(UsersService);
        injectYourService

    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);