import type { Order } from '../order';

export abstract class OrdersWriterRepository {
    public abstract save(order: Order): Promise<Order>;
    public abstract update(order: Order): Promise<Order>;
}

export const ORDERS_WRITER_REPOSITORY = Symbol('ORDERS_WRITER_REPOSITORY');
