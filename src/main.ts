import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
    const API_PREFIX = process.env.API_PREFIX ?? '/api';

    const config = new DocumentBuilder()
        .setTitle('Orders API')
        .setDescription('ISC ATM Integrator — Orders CQRS reference API')
        .setVersion('1.0')
        .addTag('orders')
        .build();

    const app = await NestFactory.create(AppModule);
    const document = SwaggerModule.createDocument(app, config, {
        ignoreGlobalPrefix: false,
    });

    app.setGlobalPrefix(API_PREFIX);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.use(
        `${API_PREFIX}/reference`,
        apiReference({
            theme: 'purple',
            content: document,
        }),
    );

    await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();
