import { Entity, PrimaryColumn, Column } from 'typeorm';
import { OrderStatus } from '../../domain/enums';

@Entity('orders')
export class OrderEntity {
    @PrimaryColumn()
    public id: string;

    @Column()
    public customer: string;

    @Column('real')
    public total: number;

    @Column({ type: 'simple-enum', enum: OrderStatus })
    public status: OrderStatus;
}
