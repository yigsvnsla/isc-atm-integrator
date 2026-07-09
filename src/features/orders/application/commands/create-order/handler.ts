import { CommandHandler } from '@cqrs/command';
import { CreateOrderCommand } from './command';
import { CreateOrderResponse } from './response';
import { CreateOrderMapper } from './mapper';
import { InMemoryOrderRepository } from '@features/orders/infrastructure/order.repository';

export class CreateOrderHandler implements CommandHandler<
    CreateOrderCommand,
    CreateOrderResponse
> {
    public constructor(
        private readonly mapper: CreateOrderMapper,
        private readonly repository: InMemoryOrderRepository,
    ) {}

    public async execute(
        command: CreateOrderCommand,
    ): Promise<CreateOrderResponse> {
        const order = this.mapper.toDomain(command);
        await this.repository.save(order);
        return this.mapper.toResponse(order);
    }
}
