import { Module } from '@nestjs/common';

import { OrdersModule } from './features/orders/orders.module';
import { NotificationsModule } from '@features/notifications/notifications.module';

@Module({
    imports: [OrdersModule, NotificationsModule],
})
export class AppModule {}
