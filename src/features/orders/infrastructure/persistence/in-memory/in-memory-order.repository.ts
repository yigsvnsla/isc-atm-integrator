import { IOrderRepository } from '@features/orders/domain/order.repository';
import { Order } from '@features/orders/domain/order';

export class InMemoryOrderRepository implements IOrderRepository {
    private readonly store = new Map<string, Order>();

    // eslint-disable-next-line @typescript-eslint/require-await
    public async save(order: Order): Promise<Order> {
        this.store.set(order.id, order);
        return order;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async findById(id: string): Promise<Order | null> {
        return this.store.get(id) ?? null;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async findAll(page: number, limit: number) {
        const all = [...this.store.values()];
        const total = all.length;
        const start = (page - 1) * limit;
        return {
            items: all.slice(start, start + limit),
            total,
            page,
            limit,
        };
    }
}
