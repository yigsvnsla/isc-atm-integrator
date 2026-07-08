import type { Order } from '../order';

export abstract class OrdersReaderRepository {
    public abstract findById(id: string): Promise<Order | null>;
    public abstract findAll(): Promise<Order[]>;
}

export const ORDERS_READER_REPOSITORY = Symbol('ORDERS_READER_REPOSITORY');
