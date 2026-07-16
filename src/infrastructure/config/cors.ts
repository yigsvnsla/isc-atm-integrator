import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '@shared/core/types';

export const corsSetup = (app: INestApplication<any>): CorsOptions => {
    const configService = app.get<AppConfigService>(ConfigService);

    return {
        origin: configService.get('server.cors.origin', { infer: true }),
        methods: configService.get('server.cors.methods', { infer: true }),
        credentials: configService.get('server.cors.credentials', {
            infer: true,
        }),
    };
};
