import { RequestWithOrg } from './../../../../.nx/cache/1395239590521343294/passion-load-service/dist/common/types/request-with-org.d';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class OrgMiddleware implements NestMiddleware {
  use(req: RequestWithOrg, _res: Response, next: NextFunction) {
    const headerName = (
      process.env.ORG_HEADER_NAME || 'x-organization-id'
    ).toLowerCase();

    const orgId = req.headers[headerName] as string | undefined;
    if (orgId) req.organizationId = orgId;

    next();
  }
}
