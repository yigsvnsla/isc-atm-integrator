import { ApiProperty } from '@nestjs/swagger';
import { Order } from '@features/orders/domain/order';

export class OrderResponseDto {
    public readonly id!: string;

    public readonly customerName!: string;

    public readonly amount!: number;

    @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled'] })
    public readonly status!: 'pending' | 'confirmed' | 'cancelled';

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
