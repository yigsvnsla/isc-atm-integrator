import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { HttpExceptionToApiResponseErrorAdapter } from './exception-adapter-ctx-to-api-response-error';
import { HttpAdapterHost } from '@nestjs/core';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly cls: ClsService,
    ) {}

    public catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const httpAdapter = this.httpAdapterHost.httpAdapter;

        const apiResponseError = new HttpExceptionToApiResponseErrorAdapter(
            ctx,
            exception,
            httpAdapter,
            this.cls,
        );

        this.logger.error(
            `Exception caught: ${JSON.stringify(exception.getResponse())}`,
        );
        this.logger.debug(`Exception trace: ${exception.stack}`);
        httpAdapter.reply(response, apiResponseError, apiResponseError.status);
    }
}
