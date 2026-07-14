// export const

import { INestApplication } from '@nestjs/common';
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { ApiResponseError } from '@shared/core/response/api-response-error';
import { ConfigService } from '@nestjs/config';
import swaggerMetadata from '../../metadata';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppConfigService } from '@shared/core/types';

export const swaggerSetup = async (app: INestApplication<any>) => {
    const configService = app.get<AppConfigService>(ConfigService);

    const appPrefix = configService.get('server.prefix', { infer: true });

    const manifest = new DocumentBuilder()
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

    const options: SwaggerDocumentOptions = {
        ignoreGlobalPrefix: true,
    };

    await SwaggerModule.loadPluginMetadata(swaggerMetadata);

    const swaggerDocument = SwaggerModule.createDocument(
        app,
        manifest,
        options,
    );

    return apiReference({ theme: 'purple', content: swaggerDocument });
};
