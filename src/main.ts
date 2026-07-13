import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from '@infrastructure/config/configuration';
import swaggerMetadata from './metadata';
import { ApiResponseError } from '@shared/core/response/api-response-error';

// TODO: mover este tipado a donde corresponde, ya que genera una dependecia directa del modulo de arranque
export type AppConfigService = ConfigService<
    ReturnType<typeof configuration>,
    true
>;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get<AppConfigService>(ConfigService);

    const appPort = configService.get('server.port', { infer: true });
    const appPrefix = configService.get('server.prefix', { infer: true });

    const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    });

    app.setGlobalPrefix(appPrefix);
    app.useGlobalPipes(validationPipe);
    app.enableVersioning({
        type: VersioningType.HEADER,
        header: 'x-api-version',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await SwaggerModule.loadPluginMetadata(swaggerMetadata);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('ISC ATM Integrator')
        .setDescription('Orders API — CQRS manual mediator demo')
        .setVersion('1.0')
        .addTag('Orders')
        .addServer(appPrefix, 'Local API with prefix')
        .addGlobalParameters({
            name: 'x-api-version',
            in: 'header',
            description: 'API version',
            required: true,
            schema: { type: 'string', default: '1' },
        })

        .addGlobalResponse({
            status: '4XX',
            description: 'Client error',
            type: ApiResponseError,
        })
        .addGlobalResponse({
            status: '5XX',
            description: 'Internal server error',
            type: ApiResponseError,
        })
        .addGlobalResponse({
            status: 'default',
            description: 'Unexpected error',
            type: ApiResponseError,
        })
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
        ignoreGlobalPrefix: true,
    });

    app.use(
        `${appPrefix}/reference`,
        apiReference({ theme: 'purple', content: document }),
    );

    await app.listen(appPort);
}

void bootstrap();
