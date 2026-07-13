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

export class Order {
    public readonly id: string;
    public readonly customerName: string;
    public readonly amount: number;
    public readonly status: 'pending' | 'confirmed' | 'cancelled';
    public readonly createdAt: Date;

    public constructor(
        id: string,
        customerName: string,
        amount: number,
        status: 'pending' | 'confirmed' | 'cancelled',
        createdAt: Date,
    ) {
        this.id = id;
        this.customerName = customerName;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static get Builder(): OrderBuilder {
        return new OrderBuilder();
    }
}
