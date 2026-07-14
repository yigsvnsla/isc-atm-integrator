import { HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler } from '@cqrs/command';
import { CreateOrderCommand } from './command';
import { CreateOrderResponse } from './response.dto';
// import { CreateOrderMapper } from './mapper';
import { ORDER_REPOSITORY } from '@features/orders/domain/order.repository';
import type { IOrderRepository } from '@features/orders/domain/order.repository';
import { Order, ORDER_STATUS } from '@features/orders/domain/order';
import { ResponseMetadataBuilder } from '@shared/core/response/api-response-metadata-builder';
import { CacheResultService } from '@core/cache/cache-result.service';

export class CreateOrderHandler implements CommandHandler<
    CreateOrderCommand,
    CreateOrderResponse
> {
    public constructor(
        // private readonly mapper: CreateOrderMapper,
        @Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository,
        private readonly cacheResult: CacheResultService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/require-await
    public async execute(
        command: CreateOrderCommand,
    ): Promise<CreateOrderResponse> {
        // const order = this.mapper.toDomain(command);
        console.log(command);

        // await this.repository.save(order);
        void this.cacheResult.clear();

        const result = Order.Builder.setId(crypto.randomUUID())
            .setCustomerName(command.name)
            .setAmount(command.pricing)
            .setStatus(ORDER_STATUS.PENDING)
            .setCreatedAt(new Date())
            .build();

        const metadata = new ResponseMetadataBuilder()
            .setStatusCode(HttpStatus.OK)
            .setMessage('OK')
            .build();

        const response = new CreateOrderResponse(result, metadata);

        return response;

        // return this.mapper.toResponse(order);
    }
}
