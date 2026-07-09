import { NotFoundError } from '@core/errors';
import { QueryHandler } from '@cqrs/query';
import { InMemoryOrderRepository } from '@features/orders/infrastructure/order.repository';
import { Order } from '@features/orders/domain/order';
import { GetOrderByIdQuery } from './query';

export class GetOrderByIdHandler implements QueryHandler<
    GetOrderByIdQuery,
    Order
> {
    public constructor(private readonly repository: InMemoryOrderRepository) {}

    public async execute(query: GetOrderByIdQuery): Promise<Order> {
        const order = await this.repository.findOneBy({ id: query.getId() });
        if (!order) {
            throw new NotFoundError('Order', query.getId());
        }
        return order;
    }
}
