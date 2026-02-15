import { NextFunction } from 'express';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { RequestContext, UserRole } from "../types/request-context";

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
    use(req: RequestContext, _res: Response, next: NextFunction) {
        const rawRole = req.header('x-user-role');
        const role = rawRole ? (rawRole.toUpperCase() as UserRole) : undefined;
        const id = req.header('x-user-id') ?? undefined;

        if (role) req.user = { id, role };
        
        next();
    }
}