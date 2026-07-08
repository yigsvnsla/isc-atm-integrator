import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler } from '../../../../../shared/cqrs/query-handler';
import { Result } from '../../../../../shared/core/result';
import type { QueryResult } from '../../../../../shared/core/types';
import {
    ORDERS_READER_REPOSITORY,
    OrdersReaderRepository,
} from '../../../domain/ports/orders-reader.repository';
import { GetOrderListQuery } from './query';
import { GetOrderListResponse } from './response';
import { OrderResponse } from '../../responses/order-response';

@Injectable()
export class GetOrderListHandler implements QueryHandler<
    GetOrderListQuery,
    QueryResult<GetOrderListResponse>
> {
    constructor(
        @Inject(ORDERS_READER_REPOSITORY)
        private readonly reader: OrdersReaderRepository,
    ) {}

    public async execute(
        _query: GetOrderListQuery,
    ): Promise<QueryResult<GetOrderListResponse>> {
        void _query;
        const orders = await this.reader.findAll();
        return Result.success<GetOrderListResponse, never>(
            new GetOrderListResponse(
                orders.map((order) => OrderResponse.from(order)),
            ),
        );
    }
}
