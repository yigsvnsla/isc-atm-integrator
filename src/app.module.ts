import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './features/notifications/notifications.module';
import { OrdersModule } from './features/orders/orders.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { CqrsModule } from './shared/cqrs/cqrs.module';
import { ResultInterceptor } from './shared/infrastructure/http/result.interceptor';

@Module({
    imports: [DatabaseModule, CqrsModule, OrdersModule, NotificationsModule],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: ResultInterceptor },
    ],
})
export class AppModule {}
