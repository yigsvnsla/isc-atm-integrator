import { NotFoundException, Inject, HttpStatus } from '@nestjs/common';
import { QueryHandler } from '@cqrs/query';
import { ORDER_REPOSITORY } from '@features/orders/domain/order.repository';
import type { IOrderRepository } from '@features/orders/domain/order.repository';
import { GetOrderByIdQuery } from './query';
import { GetOrderByIdResponse } from './response.dto';
import { ResponseMetadataBuilder } from '@shared/core/response/api-response-metadata-builder';
import { Order } from '@features/orders/domain/order';

export class GetOrderByIdHandler implements QueryHandler<
    GetOrderByIdQuery,
    GetOrderByIdResponse
> {
    public constructor(
        @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
    ) {}

    public async execute(
        query: GetOrderByIdQuery,
    ): Promise<GetOrderByIdResponse> {
        const order = await this.repository.findById(query.getId());
        if (!order) {
            throw new NotFoundException(
                `Order with ID ${query.getId()} not found`,
            );
        }

        const metadata = new ResponseMetadataBuilder()
            .setStatusCode(HttpStatus.OK)
            .setMessage('OK')
            .build();

        const result = {} as Order;
        const response = new GetOrderByIdResponse(result, metadata);

        return response;
    }
}
