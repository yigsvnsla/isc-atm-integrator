import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdersReaderRepository } from '../../domain/ports/orders-reader.repository';
import { Order } from '../../domain/order';
import { OrderEntity } from './order.entity';
import { OrderMapper } from './order.mapper';

@Injectable()
export class SqlOrdersReaderRepository extends OrdersReaderRepository {
    constructor(
        @Inject('READ_DATA_SOURCE') private readonly dataSource: DataSource,
    ) {
        super();
    }

    public async findById(id: string): Promise<Order | null> {
        const repository = this.dataSource.getRepository(OrderEntity);
        const entity = await repository.findOneBy({ id });
        return entity ? OrderMapper.toDomain(entity) : null;
    }

    public async findAll(): Promise<Order[]> {
        const repository = this.dataSource.getRepository(OrderEntity);
        const entities = await repository.find();
        return entities.map((entity) => OrderMapper.toDomain(entity));
    }
}
