import { QueryHandler } from '@cqrs/query';
import { InMemoryOrderRepository } from '@features/orders/infrastructure/order.repository';
import { Order } from '@features/orders/domain/order';
import { GetOrdersQuery } from './query';

export class GetOrdersHandler implements QueryHandler<GetOrdersQuery, Order[]> {
    public constructor(private readonly repository: InMemoryOrderRepository) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async execute(query: GetOrdersQuery): Promise<Order[]> {
        return this.repository.find();
    }
}
