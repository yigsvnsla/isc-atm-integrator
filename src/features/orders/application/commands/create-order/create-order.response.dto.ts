import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderResponse {
    @ApiProperty({ example: '267c00a9-865e-4b6b-af47-c81a021cc038' })
    public readonly id!: string;

    @ApiProperty({
        example: 'pending',
        enum: ['pending', 'confirmed', 'cancelled'],
    })
    public readonly status!: 'pending' | 'confirmed' | 'cancelled';

    @ApiProperty({ example: '2026-07-09T22:31:30.974Z' })
    public readonly createdAt!: string;
}
