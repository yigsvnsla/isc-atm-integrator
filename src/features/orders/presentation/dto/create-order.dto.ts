import { IsString, IsNumber, MinLength, Min } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @MinLength(1)
    public readonly customer: string;

    @IsNumber()
    @Min(0)
    public readonly total: number;
}
