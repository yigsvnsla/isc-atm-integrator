import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrderRepository } from '@features/orders/domain/order.repository';
import { Order } from '@features/orders/domain/order';
import { OrderEntity } from './order.entity';

export class TypeormOrderRepository implements IOrderRepository {
    public constructor(
        @InjectRepository(OrderEntity)
        private readonly repo: Repository<OrderEntity>,
    ) {}

    public async save(order: Order): Promise<Order> {
        const entity = OrderEntity.fromDomain(order);
        await this.repo.save(entity);
        return order;
    }

    public async findById(id: string): Promise<Order | null> {
        const entity = await this.repo.findOneBy({ id });
        return entity ? OrderEntity.toDomain(entity) : null;
    }

    public async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.repo.findAndCount({
            skip,
            take: limit,
        });
        return {
            items: items.map(OrderEntity.toDomain),
            total,
            page,
            limit,
        };
    }
}
