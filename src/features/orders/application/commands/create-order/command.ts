import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Command } from '@cqrs/command';

export class CreateOrderCommand implements Command {
    @ApiProperty({ example: 'Alice', description: 'Customer name' })
    @IsString()
    @IsNotEmpty()
    public readonly name!: string;

    @ApiProperty({ example: 100, description: 'Order amount' })
    @IsNumber()
    @Min(0.01)
    public readonly pricing!: number;
}
