import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestWithOrg } from '../types/request-with-org';

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
