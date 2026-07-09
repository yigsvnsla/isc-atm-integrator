import { Query } from '@cqrs/query';
import { Order } from '@features/orders/domain/order';

export class GetOrderByIdQuery implements Query<Order> {
    public constructor(private readonly id: string) {}

    public getId(): string {
        return this.id;
    }
}
