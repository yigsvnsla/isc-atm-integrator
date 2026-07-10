import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@shared/core/exception-filter';

async function bootstrap() {
    const API_PREFIX = process.env.API_PREFIX ?? '/api';

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix(API_PREFIX);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());

    const config = new DocumentBuilder()
        .setTitle('ISC ATM Integrator')
        .setDescription('Orders API — CQRS manual mediator demo')
        .setVersion('1.0')
        .addTag('orders')
        .addServer(API_PREFIX, 'Local API with prefix')
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        ignoreGlobalPrefix: true,
    });

    app.use(
        `${API_PREFIX}/reference`,
        apiReference({
            theme: 'purple',
            content: document,
        }),
    );

    await app.listen(process.env.PORT ?? 7000);
}

void bootstrap();
