import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler } from '../../../../../shared/cqrs/query-handler';
import { Result } from '../../../../../shared/core/result';
import { NotFoundError } from '../../../../../shared/core/errors';
import type { QueryResult } from '../../../../../shared/core/types';
import {
    ORDERS_READER_REPOSITORY,
    OrdersReaderRepository,
} from '../../../domain/ports/orders-reader.repository';
import { GetOrderQuery } from './query';
import { GetOrderResponse } from './response';
import { OrderResponse } from '../../responses/order-response';

@Injectable()
export class GetOrderHandler implements QueryHandler<
    GetOrderQuery,
    QueryResult<GetOrderResponse>
> {
    constructor(
        @Inject(ORDERS_READER_REPOSITORY)
        private readonly reader: OrdersReaderRepository,
    ) {}

    public async execute(
        query: GetOrderQuery,
    ): Promise<QueryResult<GetOrderResponse>> {
        const order = await this.reader.findById(query.id);
        if (!order) {
            return Result.failure<GetOrderResponse, NotFoundError>(
                new NotFoundError(`Order ${query.id} not found.`),
            );
        }

        return Result.success<GetOrderResponse, NotFoundError>(
            new GetOrderResponse(OrderResponse.from(order)),
        );
    }
}
