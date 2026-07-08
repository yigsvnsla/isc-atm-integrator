import { Module, OnModuleInit } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { Mediator } from '../../shared/cqrs/mediator';
import { ORDERS_WRITER_REPOSITORY } from './domain/ports/orders-writer.repository';
import { ORDERS_READER_REPOSITORY } from './domain/ports/orders-reader.repository';
import { SqlOrdersWriterRepository } from './infrastructure/persistence/sql-orders-writer.repository';
import { SqlOrdersReaderRepository } from './infrastructure/persistence/sql-orders-reader.repository';
import { CreateOrderHandler } from './application/commands/create-order/handler';
import { CancelOrderHandler } from './application/commands/cancel-order/handler';
import { GetOrderHandler } from './application/queries/get-order/handler';
import { GetOrderListHandler } from './application/queries/get-order-list/handler';
import { CreateOrderCommand } from './application/commands/create-order/command';
import { CancelOrderCommand } from './application/commands/cancel-order/command';
import { GetOrderQuery } from './application/queries/get-order/query';
import { GetOrderListQuery } from './application/queries/get-order-list/query';

@Module({
    controllers: [OrdersController],
    providers: [
        {
            provide: ORDERS_WRITER_REPOSITORY,
            useClass: SqlOrdersWriterRepository,
        },
        {
            provide: ORDERS_READER_REPOSITORY,
            useClass: SqlOrdersReaderRepository,
        },
        CreateOrderHandler,
        CancelOrderHandler,
        GetOrderHandler,
        GetOrderListHandler,
    ],
})
export class OrdersModule implements OnModuleInit {
    constructor(
        private readonly mediator: Mediator,
        private readonly createOrderHandler: CreateOrderHandler,
        private readonly cancelOrderHandler: CancelOrderHandler,
        private readonly getOrderHandler: GetOrderHandler,
        private readonly getOrderListHandler: GetOrderListHandler,
    ) {}

    public onModuleInit(): void {
        this.mediator.registerCommand(
            CreateOrderCommand,
            this.createOrderHandler,
        );
        this.mediator.registerCommand(
            CancelOrderCommand,
            this.cancelOrderHandler,
        );
        this.mediator.registerQuery(GetOrderQuery, this.getOrderHandler);
        this.mediator.registerQuery(
            GetOrderListQuery,
            this.getOrderListHandler,
        );
    }
}
