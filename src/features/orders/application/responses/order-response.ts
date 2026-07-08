import { OrderStatus } from '../../domain/enums';

export class OrderResponse {
    public readonly id: string;
    public readonly customer: string;
    public readonly total: number;
    public readonly status: OrderStatus;

    constructor(
        id: string,
        customer: string,
        total: number,
        status: OrderStatus,
    ) {
        this.id = id;
        this.customer = customer;
        this.total = total;
        this.status = status;
    }

    public static from(order: {
        id: string;
        customer: string;
        total: number;
        status: OrderStatus;
    }): OrderResponse {
        return new OrderResponse(
            order.id,
            order.customer,
            order.total,
            order.status,
        );
    }
}
