import { HttpException, HttpStatus } from '@nestjs/common';
import type { ClsService } from 'nestjs-cls';
import { IApiResponseError } from '../response/api-response-error';
import { AbstractHttpAdapter } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

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
        cls: ClsService,
    ) {
        this.id = cls.getId() || 'unknown';
        this.path = String(httpAdapter.getRequestUrl(ctx.getRequest()));
        this.code = HttpStatus[exception.getStatus()];
        this.cause = exception.cause;
        this.status = exception.getStatus();
        this.message = exception.message;
        this.timestamp = new Date().toISOString();
    }
}
