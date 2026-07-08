import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdersWriterRepository } from '../../domain/ports/orders-writer.repository';
import { Order } from '../../domain/order';
import { OrderEntity } from './order.entity';
import { OrderMapper } from './order.mapper';

@Injectable()
export class SqlOrdersWriterRepository extends OrdersWriterRepository {
    constructor(
        @Inject('WRITE_DATA_SOURCE') private readonly dataSource: DataSource,
    ) {
        super();
    }

    public async save(order: Order): Promise<Order> {
        const repository = this.dataSource.getRepository(OrderEntity);
        const entity = OrderMapper.toPersistence(order);
        await repository.save(entity);
        return order;
    }

    public async update(order: Order): Promise<Order> {
        const repository = this.dataSource.getRepository(OrderEntity);
        const entity = OrderMapper.toPersistence(order);
        await repository.save(entity);
        return order;
    }
}
