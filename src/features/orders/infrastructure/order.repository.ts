import { Repository } from 'typeorm';
import { Order } from '@features/orders/domain/order';

interface FindByIdWhere {
    readonly id?: string;
}

export class InMemoryOrderRepository extends Repository<Order> {
    private readonly store = new Map<string, Order>();

    public constructor() {
        super(Order, {} as never, undefined);
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public override async save<T extends Order>(entity: T): Promise<T> {
        this.store.set(entity.id, entity);
        return entity;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public override async findOneBy(
        where: FindByIdWhere,
    ): Promise<Order | null> {
        if (where.id !== undefined) {
            return this.store.get(where.id) ?? null;
        }
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public override async find(): Promise<Order[]> {
        return [...this.store.values()];
    }
}
