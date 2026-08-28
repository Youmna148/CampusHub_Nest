import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { UserDocument } from '../../users/schemas/user.schema';

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserDocument => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user!;
  },
);
