import { Order } from '../../domain/order';
import { OrderEntity } from './order.entity';

export class OrderMapper {
    public static toDomain(entity: OrderEntity): Order {
        return Order.restore(
            entity.id,
            entity.customer,
            entity.total,
            entity.status,
        );
    }

    public static toPersistence(order: Order): OrderEntity {
        const entity = new OrderEntity();
        entity.id = order.id;
        entity.customer = order.customer;
        entity.total = order.total;
        entity.status = order.status;
        return entity;
    }
}
