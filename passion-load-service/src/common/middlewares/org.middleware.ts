import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Response, NextFunction } from 'express';
import type { RequestContext } from '../types/request-context';

@Injectable()
export class OrgMiddleware implements NestMiddleware {
  use(req: RequestContext, _res: Response, next: NextFunction) {
    const orgId = req.header('x-organization-id') ?? undefined;
    req.organizationId = orgId;
    next();
  }
}
