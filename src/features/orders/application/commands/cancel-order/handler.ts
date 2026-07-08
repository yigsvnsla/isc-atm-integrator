import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler } from '../../../../../shared/cqrs/command-handler';
import { Result } from '../../../../../shared/core/result';
import {
    NotFoundError,
    ConflictError,
} from '../../../../../shared/core/errors';
import type { CommandResult } from '../../../../../shared/core/types';
import {
    ORDERS_WRITER_REPOSITORY,
    OrdersWriterRepository,
} from '../../../domain/ports/orders-writer.repository';
import {
    ORDERS_READER_REPOSITORY,
    OrdersReaderRepository,
} from '../../../domain/ports/orders-reader.repository';
import { CancelOrderCommand } from './command';
import { CancelOrderResponse } from './response';
import { OrderResponse } from '../../responses/order-response';

type CancelError = NotFoundError | ConflictError;

@Injectable()
export class CancelOrderHandler implements CommandHandler<
    CancelOrderCommand,
    CommandResult<CancelOrderResponse>
> {
    constructor(
        @Inject(ORDERS_READER_REPOSITORY)
        private readonly reader: OrdersReaderRepository,
        @Inject(ORDERS_WRITER_REPOSITORY)
        private readonly writer: OrdersWriterRepository,
    ) {}

    public async execute(
        command: CancelOrderCommand,
    ): Promise<CommandResult<CancelOrderResponse>> {
        const existing = await this.reader.findById(command.id);
        if (!existing) {
            return Result.failure<CancelOrderResponse, CancelError>(
                new NotFoundError(`Order ${command.id} not found.`),
            );
        }

        try {
            const cancelled = existing.cancel();
            await this.writer.update(cancelled);
            return Result.success<CancelOrderResponse, CancelError>(
                new CancelOrderResponse(OrderResponse.from(cancelled)),
            );
        } catch (error) {
            return Result.failure<CancelOrderResponse, CancelError>(
                new ConflictError(
                    error instanceof Error ? error.message : 'Unknown error',
                ),
            );
        }
    }
}
