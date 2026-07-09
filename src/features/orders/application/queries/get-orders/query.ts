import { Order } from '@features/orders/domain/order';
import { Query } from '@cqrs/query';

export class GetOrdersQuery implements Query<Order[]> {}
