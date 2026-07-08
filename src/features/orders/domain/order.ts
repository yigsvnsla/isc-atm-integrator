import { randomUUID } from 'crypto';
import { OrderStatus } from './enums';

export class Order {
    private constructor(
        public readonly id: string,
        public readonly customer: string,
        public readonly total: number,
        public readonly status: OrderStatus,
    ) {}

    public static create(customer: string, total: number): Order {
        if (!customer || customer.trim().length === 0) {
            throw new Error('Order customer cannot be empty.');
        }

        if (total < 0) {
            throw new Error('Order total cannot be negative.');
        }

        return new Order(randomUUID(), customer, total, OrderStatus.PENDING);
    }

    public static restore(
        id: string,
        customer: string,
        total: number,
        status: OrderStatus,
    ): Order {
        return new Order(id, customer, total, status);
    }

    public cancel(): Order {
        if (this.status === OrderStatus.CANCELLED) {
            throw new Error('Order is already cancelled.');
        }

        return new Order(
            this.id,
            this.customer,
            this.total,
            OrderStatus.CANCELLED,
        );
    }

    public isActive(): boolean {
        return this.status !== OrderStatus.CANCELLED;
    }
}
