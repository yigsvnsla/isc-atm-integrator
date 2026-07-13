import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediatorModule } from '@cqrs/mediator.module';
import { OrderEntity } from './infrastructure/persistence/typeorm/order.entity';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { TypeormOrderRepository } from './infrastructure/persistence/typeorm/typeorm-order.repository';
import { OrdersController } from './orders.controller';
import { CreateOrderHandler } from './application/commands/create-order/handler';
import { CreateOrderMapper } from './application/commands/create-order/mapper';
import { GetOrdersHandler } from './application/queries/get-orders/handler';
import { GetOrderByIdHandler } from './application/queries/get-order-by-id/handler';
import { Mediator } from '@shared/cqrs/mediator';
import { CreateOrderCommand } from './application/commands/create-order/command';
import { GetOrdersQuery } from './application/queries/get-orders/query';
import { GetOrderByIdQuery } from './application/queries/get-order-by-id/query';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity]), MediatorModule],
    controllers: [OrdersController],
    providers: [
        { provide: ORDER_REPOSITORY, useClass: TypeormOrderRepository },
        CreateOrderHandler,
        CreateOrderMapper,
        GetOrdersHandler,
        GetOrderByIdHandler,
    ],
})
export class OrdersModule {
    public constructor(
        readonly mediator: Mediator,
        readonly createOrderHandler: CreateOrderHandler,
        readonly getOrdersHandler: GetOrdersHandler,
        readonly getOrderByIdHandler: GetOrderByIdHandler,
    ) {
        this.mediator.registerCommand(
            CreateOrderCommand,
            this.createOrderHandler,
        );
        this.mediator.registerQuery(GetOrdersQuery, this.getOrdersHandler);
        this.mediator.registerQuery(
            GetOrderByIdQuery,
            this.getOrderByIdHandler,
        );
    }
}
