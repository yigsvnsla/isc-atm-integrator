import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { runWithContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    public use(req: Request, res: Response, next: NextFunction): void {
        const requestId =
            (req.headers['x-request-id'] as string) || randomUUID();

        res.setHeader('x-request-id', requestId);

        runWithContext(requestId, () => next());
    }
}
