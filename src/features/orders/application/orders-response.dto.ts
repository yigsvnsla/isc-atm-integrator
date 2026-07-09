import { ApiProperty } from '@nestjs/swagger';
import { Order } from '@features/orders/domain/order';

export class OrderResponseDto {
    @ApiProperty()
    public readonly id!: string;

    @ApiProperty()
    public readonly customerName!: string;

    @ApiProperty()
    public readonly amount!: number;

    @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled'] })
    public readonly status!: 'pending' | 'confirmed' | 'cancelled';

    @ApiProperty()
    public readonly createdAt!: string;
}

export function toOrderResponseDto(order: Order): OrderResponseDto {
    return {
        id: order.id,
        customerName: order.customerName,
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
    };
}
