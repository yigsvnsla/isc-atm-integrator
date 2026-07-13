import { HttpStatus, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { QueryHandler } from '@cqrs/query';
import { ORDER_REPOSITORY } from '@features/orders/domain/order.repository';
import type { IOrderRepository } from '@features/orders/domain/order.repository';
import { GetOrdersQuery } from './query';
import { GetOrdersResponse } from './response.dto';
// import { toGetOrderByIdResponse } from '../get-order-by-id/response';
import { ResponseMetadataPaginationBuilder } from '@core/response/api-response-metadata-pagination-builder';
import { ResponseMetadataBuilder } from '@core/response/api-response-metadata-builder';

export class GetOrdersHandler implements QueryHandler<
    GetOrdersQuery,
    GetOrdersResponse
> {
    public constructor(
        @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    public async execute(query: GetOrdersQuery): Promise<GetOrdersResponse> {
        const cacheKey = `orders:p${query.page}:l${query.limit}`;
        const cached = await this.cache.get<GetOrdersResponse>(cacheKey);
        if (cached) return cached;

        const result = await this.repository.findAll(query.page, query.limit);

        const pagination = new ResponseMetadataPaginationBuilder()
            .setPage(result.page)
            .setLimit(result.limit)
            .setTotalItems(result.total)
            .build();

        const metadata = new ResponseMetadataBuilder()
            .setStatusCode(HttpStatus.OK)
            .setMessage('OK')
            .setPagination(pagination)
            .build();

        // TODO: result.items -> data Response
        const response = new GetOrdersResponse([], metadata);

        await this.cache.set(cacheKey, response);

        return response;
    }
}
