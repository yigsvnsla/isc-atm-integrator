import { HttpException, HttpStatus } from '@nestjs/common';
import { IApiResponseError } from '../response/api-response-error';
import { AbstractHttpAdapter } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { getRequestId } from '../middleware/request-context';

export class HttpExceptionToApiResponseErrorAdapter implements IApiResponseError {
    public readonly id: string;
    public readonly path: string;
    public readonly code: string;
    public readonly cause: unknown;
    public readonly status: number;
    public readonly message: string;
    public readonly timestamp: string;

    constructor(
        ctx: HttpArgumentsHost,
        exception: HttpException,
        httpAdapter: AbstractHttpAdapter<any, any, any>,
    ) {
        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.path = httpAdapter.getRequestUrl(ctx.getRequest());
        this.code = HttpStatus[exception.getStatus()];
        this.cause = exception.cause;
        this.status = exception.getStatus();
        this.message = exception.message;
        this.timestamp = new Date().toISOString();
        this.id = this.resolveRequestId(ctx);
    }

    private resolveRequestId(ctx: HttpArgumentsHost): string {
        const requestId = getRequestId();
        if (requestId) return requestId;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const req = ctx.getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (req?.headers?.['x-request-id']) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
            return req.headers['x-request-id'];
        }

        return 'unknown';
    }
}
