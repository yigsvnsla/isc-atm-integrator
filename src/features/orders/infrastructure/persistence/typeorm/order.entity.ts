import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Order } from '@features/orders/domain/order';

@Entity('orders')
export class OrderEntity {
    @PrimaryColumn({ name: 'id' })
    public id!: string;

    @Column({ name: 'customer_name' })
    public customerName!: string;

    @Column({ name: 'amount' })
    public amount!: number;

    @Column({ name: 'status' })
    public status!: string;

    @Column({ name: 'created_at' })
    public createdAt!: Date;

    public static toDomain(entity: OrderEntity): Order {
        return new Order(
            entity.id,
            entity.customerName,
            entity.amount,
            entity.status as 'pending' | 'confirmed' | 'cancelled',
            entity.createdAt,
        );
    }

    public static fromDomain(order: Order): OrderEntity {
        const entity = new OrderEntity();
        entity.id = order.id;
        entity.customerName = order.customerName;
        entity.amount = order.amount;
        entity.status = order.status;
        entity.createdAt = order.createdAt;
        return entity;
    }
}
