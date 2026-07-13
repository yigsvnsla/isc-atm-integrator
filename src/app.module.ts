import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from '@infrastructure/config/configuration';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { MediatorModule } from '@cqrs/mediator.module';
import { OrdersModule } from './features/orders/orders.module';
import { NotificationsModule } from '@features/notifications/notifications.module';
import { AllExceptionsFilter } from '@shared/core/exception-filter';

@Module({
    imports: [
        DatabaseModule.forRoot(),
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            cache: true,
        }),
        CacheModule,
        MediatorModule,
        OrdersModule,
        NotificationsModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
