import { Request } from 'express';

export type UserRole = 'TEACHER' | 'ADMIN'| 'STUDENT';

export interface RequestContext extends Request {
    organizationId?: string;
    user?: {
        id?: string;
        role?: UserRole;
    };
}