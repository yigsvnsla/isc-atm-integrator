import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { NotFoundError, ValidationError } from '@core/errors';

interface ErrorResponseBody {
    readonly statusCode: number;
    readonly error?: string;
    readonly message: string | string[];
    readonly path?: string;
    readonly timestamp: string;
    readonly resource?: string;
    readonly id?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const body = this.buildBody(exception, request.url);
        response.status(body.statusCode).json(body);
    }

    private buildBody(
        exception: unknown,
        path: string | undefined,
    ): ErrorResponseBody {
        const timestamp = new Date().toISOString();

        if (exception instanceof ValidationError) {
            return {
                statusCode: 400,
                error: 'Bad Request',
                message: exception.messages,
                path,
                timestamp,
            };
        }

        if (exception instanceof NotFoundError) {
            return {
                statusCode: 404,
                error: 'Not Found',
                message: exception.message,
                path,
                timestamp,
                resource: exception.resource,
                id: exception.id,
            };
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse() as Record<string, unknown>;
            return {
                statusCode: status,
                error: (res.error as string) ?? undefined,
                message:
                    (res.message as string | string[]) ?? exception.message,
                path,
                timestamp,
            };
        }

        if (exception instanceof Error) {
            this.logger.error(exception.message, exception.stack);
        } else {
            this.logger.error(`Unknown exception: ${String(exception)}`);
        }

        return {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Internal server error',
            path,
            timestamp,
        };
    }
}
