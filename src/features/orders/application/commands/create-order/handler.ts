import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler } from '../../../../../shared/cqrs/command-handler';
import { Result } from '../../../../../shared/core/result';
import { ValidationError } from '../../../../../shared/core/errors';
import type { CommandResult } from '../../../../../shared/core/types';
import {
    ORDERS_WRITER_REPOSITORY,
    OrdersWriterRepository,
} from '../../../domain/ports/orders-writer.repository';
import { Order } from '../../../domain/order';
import { CreateOrderCommand } from './command';
import { CreateOrderResponse } from './response';
import { OrderResponse } from '../../responses/order-response';

@Injectable()
export class CreateOrderHandler implements CommandHandler<
    CreateOrderCommand,
    CommandResult<CreateOrderResponse>
> {
    constructor(
        @Inject(ORDERS_WRITER_REPOSITORY)
        private readonly writer: OrdersWriterRepository,
    ) {}

    public async execute(
        command: CreateOrderCommand,
    ): Promise<CommandResult<CreateOrderResponse>> {
        try {
            const order = Order.create(command.customer, command.total);
            await this.writer.save(order);
            return Result.success<CreateOrderResponse, ValidationError>(
                new CreateOrderResponse(OrderResponse.from(order)),
            );
        } catch (error) {
            return Result.failure<CreateOrderResponse, ValidationError>(
                new ValidationError(
                    error instanceof Error ? error.message : 'Unknown error',
                ),
            );
        }
    }
}
