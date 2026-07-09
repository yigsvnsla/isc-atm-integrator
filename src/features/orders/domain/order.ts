import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderBuilder {
    private id: string;
    private customerName: string;
    private amount: number;
    private status: 'pending' | 'confirmed' | 'cancelled';
    private createdAt: Date;

    public setId(id: string): this {
        this.id = id;
        return this;
    }

    public setCustomerName(customerName: string): this {
        this.customerName = customerName;
        return this;
    }

    public setAmount(amount: number): this {
        this.amount = amount;
        return this;
    }

    public setStatus(status: 'pending' | 'confirmed' | 'cancelled'): this {
        this.status = status;
        return this;
    }

    public setCreatedAt(createdAt: Date): this {
        this.createdAt = createdAt;
        return this;
    }

    public build(): Order {
        return new Order(
            this.id,
            this.customerName,
            this.amount,
            this.status,
            this.createdAt,
        );
    }
}

@Entity()
export class Order {
    @PrimaryColumn()
    public id!: string;

    @Column()
    public customerName!: string;

    @Column()
    public amount!: number;

    @Column()
    public status!: 'pending' | 'confirmed' | 'cancelled';

    @Column()
    public createdAt!: Date;

    public constructor(
        id?: string,
        customerName?: string,
        amount?: number,
        status?: 'pending' | 'confirmed' | 'cancelled',
        createdAt?: Date,
    ) {
        this.id = id as string;
        this.customerName = customerName as string;
        this.amount = amount as number;
        this.status = status as 'pending' | 'confirmed' | 'cancelled';
        this.createdAt = createdAt as Date;
    }

    public static get Builder(): OrderBuilder {
        return new OrderBuilder();
    }
}
