import { Request } from 'express';

export interface RequestWithOrg extends Request {
  organizationId?: string;
}
