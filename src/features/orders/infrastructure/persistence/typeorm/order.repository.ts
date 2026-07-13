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

    public async save(order: Order): Promise<OrderEntity> {
        const result = await this.repo.save(order);
        return result;
    }

    public async findById(id: string): Promise<OrderEntity | null> {
        const result = await this.repo.findOneBy({ id });
        return result;
    }

    public async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.repo.findAndCount({
            skip,
            take: limit,
        });
        return {
            items,
            total,
            page,
            limit,
        };
    }
}
