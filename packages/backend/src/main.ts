import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { swaggerSetup } from '@infrastructure/config/swagger';
import { validationsSetup } from '@infrastructure/config/validations';
import { versioningSetup } from '@infrastructure/config/versioning';
import { AppConfigService } from '@shared/core/types';
import { corsSetup } from '@infrastructure/config/cors';
import { asyncLocalStorageSetup } from '@infrastructure/config/async-local-storage';
import { csrfSetup } from '@features/auth/infrastructure/csrf.middleware';
import { helmetSetup } from '@infrastructure/config/helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { snapshot: true });

    const configService = app.get<AppConfigService>(ConfigService);

    const appPort = configService.get('server.port', { infer: true });
    const appPrefix = configService.get('server.prefix', { infer: true });

    app.enableVersioning(versioningSetup);
    app.enableShutdownHooks();
    app.enableCors(corsSetup(app));
    app.setGlobalPrefix(appPrefix);
    app.useGlobalPipes(validationsSetup);
    csrfSetup(app);
    helmetSetup(app);
    app.use(asyncLocalStorageSetup());
    app.use(`${appPrefix}/reference`, await swaggerSetup(app));

    await app.listen(appPort);
}

void bootstrap();
