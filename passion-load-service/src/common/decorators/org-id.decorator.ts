import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { RequestContext } from '../types/request-context';

export const OrgId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestContext>();
    const orgId = req.organizationId;

    if (!orgId)
      throw new BadRequestException('x-organization-id header is required');

    return orgId as string;
  }
);
