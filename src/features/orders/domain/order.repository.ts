import { Order } from './order';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface IOrderRepository {
    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findAll(
        page: number,
        limit: number,
    ): Promise<{
        items: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
}
