import { HttpStatus, Inject } from '@nestjs/common';
import { QueryHandler } from '@cqrs/query';
import { ORDER_REPOSITORY } from '@features/orders/domain/order.repository';
import type { IOrderRepository } from '@features/orders/domain/order.repository';
import { GetOrdersQuery } from './query';
import { GetOrdersResponse } from './response.dto';
import { ResponseMetadataPaginationBuilder } from '@core/response/api-response-metadata-pagination-builder';
import { ResponseMetadataBuilder } from '@core/response/api-response-metadata-builder';
import { CacheResultService } from '@core/cache/cache-result.service';

export class GetOrdersHandler implements QueryHandler<
    GetOrdersQuery,
    GetOrdersResponse
> {
    public constructor(
        @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
        private readonly cacheResult: CacheResultService,
    ) {}

    public async execute(query: GetOrdersQuery): Promise<GetOrdersResponse> {
        const cacheKey = `orders:p${query.page}:l${query.limit}`;

        const cacheResult =
            await this.cacheResult.get<GetOrdersResponse>(cacheKey);
        if (cacheResult.isSuccess()) {
            return cacheResult.getValue();
        }

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

        const response = new GetOrdersResponse([], metadata);

        void this.cacheResult.set(cacheKey, response);

        return response;
    }
}
