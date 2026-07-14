import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from '@infrastructure/config/configuration';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { MediatorModule } from '@cqrs/mediator.module';
import { OrdersModule } from './features/orders/orders.module';
import { NotificationsModule } from '@features/notifications/notifications.module';
import { AllExceptionsFilter } from '@shared/core/exceptions/exception-filter';
import { RequestIdMiddleware } from '@shared/core/middleware/request-id.middleware';
import { HealthModule } from '@infrastructure/health/health.module';

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
        HealthModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
}
