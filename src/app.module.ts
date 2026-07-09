import { Module } from '@nestjs/common';

import { OrdersModule } from './features/orders/orders.module';

@Module({
    imports: [OrdersModule],
})
export class AppModule {}
