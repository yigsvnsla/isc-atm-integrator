import { Module } from '@nestjs/common';

import { OrdersModule } from './features/orders/orders.module';
import { NotificationsModule } from '@features/notifications/notifications.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@shared/core/exception-filter';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
    imports: [OrdersModule, NotificationsModule],
})
export class AppModule {}
