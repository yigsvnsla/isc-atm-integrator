import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Result } from '../../core/result';
import {
    AppError,
    NotFoundError,
    ValidationError,
    ConflictError,
} from '../../core/errors';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
    public intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next.handle().pipe(
            map((data: unknown) => {
                if (data instanceof Result) {
                    if (data.isSuccess()) {
                        return (data as Result<unknown, AppError>).getValue();
                    }
                    throw this.toHttpException(
                        (data as Result<unknown, AppError>).getError(),
                    );
                }
                return data;
            }),
            catchError((err: unknown) => {
                if (err instanceof AppError) {
                    throw this.toHttpException(err);
                }
                throw err;
            }),
        );
    }

    private toHttpException(error: AppError): HttpException {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof NotFoundError) {
            status = HttpStatus.NOT_FOUND;
        } else if (error instanceof ValidationError) {
            status = HttpStatus.BAD_REQUEST;
        } else if (error instanceof ConflictError) {
            status = HttpStatus.CONFLICT;
        }

        return new HttpException(
            { statusCode: status, message: error.message, code: error.code },
            status,
        );
    }
}
