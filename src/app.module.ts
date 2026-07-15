import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { ResilienceModule } from 'nestjs-resilience';
import configuration from '@infrastructure/config/configuration';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { OrdersModule } from './features/orders/orders.module';
import { AgreementsModule } from './features/agreements/agreements.module';
import { AccountsModule } from './features/accounts/accounts.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { NotificationsModule } from '@features/notifications/notifications.module';
import { AllExceptionsFilter } from '@shared/core/exceptions/exception-filter';
import { HealthModule } from '@infrastructure/health/health.module';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: { mount: false, debug: false },
        }),
        // TODO: ResilienceModule global por ahora. Evaluar mover a módulos
        // individuales (ej. OrdersModule) cuando se necesiten políticas
        // diferentes por feature o se quiera limitar el scope.
        ResilienceModule.forRoot({}),
        DatabaseModule.forRoot(),
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            cache: true,
        }),
        CacheModule,
        OrdersModule,
        AgreementsModule,
        AccountsModule,
        TransactionsModule,
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
export class AppModule {}
