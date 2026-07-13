import { Order } from '@features/orders/domain/order';
import { Query } from '@cqrs/query';

export class GetOrdersQuery implements Query<Order[]> {
    public constructor(
        public readonly page: number = 1,
        public readonly limit: number = 10,
    ) {}
}
