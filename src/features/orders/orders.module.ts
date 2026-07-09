import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import './orders.mediator';

@Module({
    imports: [],
    controllers: [OrdersController],
    providers: [],
    exports: [],
})
export class OrdersModule {}
