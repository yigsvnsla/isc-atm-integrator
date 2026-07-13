import { Order } from '@features/orders/domain/order';
import { CreateOrderCommand } from './command';
import { CreateOrderResponse } from './create-order.response.dto';

export class CreateOrderMapper {
    public toDomain(command: CreateOrderCommand): Order {
        // prettier-ignore
        const orderBuilder = Order.Builder
            .setId(crypto.randomUUID())
            .setCustomerName(command.name)
            .setAmount(command.pricing)
            .setStatus('pending')
            .setCreatedAt(new Date());

        return orderBuilder.build();
    }

    public toResponse(order: Order): CreateOrderResponse {
        return {
            id: order.id,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
        };
    }
}
