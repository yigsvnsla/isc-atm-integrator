import { QueryHandler } from '@cqrs/query';
import { InMemoryOrderRepository } from '@features/orders/infrastructure/order.repository';
import { Order } from '@features/orders/domain/order';
import { GetOrderByIdQuery } from './query';
import { NotFoundException } from '@nestjs/common';

export class GetOrderByIdHandler implements QueryHandler<
    GetOrderByIdQuery,
    Order
> {
    public constructor(private readonly repository: InMemoryOrderRepository) {}

    public async execute(query: GetOrderByIdQuery): Promise<Order> {
        const order = await this.repository.findOneBy({ id: query.getId() });
        if (!order) {
            // throw new NotFoundError('Order', query.getId());
            // TODO: Use a custom exception filter to handle NotFoundError and convert it to a proper HTTP response
            throw new NotFoundException(
                `Order with ID ${query.getId()} not found`,
            );
        }
        return order;
    }
}
