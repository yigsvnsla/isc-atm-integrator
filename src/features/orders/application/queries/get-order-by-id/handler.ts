import { NotFoundException, Inject } from '@nestjs/common';
import { QueryHandler } from '@cqrs/query';
import { ORDER_REPOSITORY } from '@features/orders/domain/order.repository';
import type { IOrderRepository } from '@features/orders/domain/order.repository';
import { GetOrderByIdQuery } from './query';
import { toOrderResponseDto } from '../../orders-response.dto';
import type { OrderResponseDto } from '../../orders-response.dto';

export class GetOrderByIdHandler
    implements QueryHandler<GetOrderByIdQuery, OrderResponseDto>
{
    public constructor(
        @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
    ) {}

    public async execute(query: GetOrderByIdQuery): Promise<OrderResponseDto> {
        const order = await this.repository.findById(query.getId());
        if (!order) {
            throw new NotFoundException(
                `Order with ID ${query.getId()} not found`,
            );
        }
        return toOrderResponseDto(order);
    }
}
