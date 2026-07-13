import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CommandHandler } from '@cqrs/command';
import { CreateOrderCommand } from './command';
import { CreateOrderResponse } from './create-order.response.dto';
import { CreateOrderMapper } from './mapper';
import { ORDER_REPOSITORY } from '@features/orders/domain/order.repository';
import type { IOrderRepository } from '@features/orders/domain/order.repository';

export class CreateOrderHandler implements CommandHandler<
    CreateOrderCommand,
    CreateOrderResponse
> {
    public constructor(
        private readonly mapper: CreateOrderMapper,
        @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    public async execute(
        command: CreateOrderCommand,
    ): Promise<CreateOrderResponse> {
        const order = this.mapper.toDomain(command);
        await this.repository.save(order);
        await this.cache.clear();
        return this.mapper.toResponse(order);
    }
}
