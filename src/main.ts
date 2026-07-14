import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClsMiddleware } from 'nestjs-cls';
import { randomUUID } from 'node:crypto';
import { swaggerSetup } from '@infrastructure/config/swagger';
import { validationsSetup } from '@infrastructure/config/validations';
import { versioningSetup } from '@infrastructure/config/versioning';
import { AppConfigService } from '@shared/core/types';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get<AppConfigService>(ConfigService);

    const appPort = configService.get('server.port', { infer: true });
    const appPrefix = configService.get('server.prefix', { infer: true });

    app.use(
        new ClsMiddleware({
            generateId: true,
            idGenerator: (req) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                (req.headers['x-request-id'] as string) || randomUUID(),
        }).use,
    );

    app.setGlobalPrefix(appPrefix);
    app.useGlobalPipes(validationsSetup);
    app.enableVersioning(versioningSetup);
    app.enableShutdownHooks();
    app.use(`${appPrefix}/reference`, await swaggerSetup(app));

    await app.listen(appPort);
}

void bootstrap();
