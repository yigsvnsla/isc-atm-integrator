import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const API_PREFIX = process.env.API_PREFIX ?? '/api';

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  app.setGlobalPrefix(API_PREFIX);

  app.use(
    `${API_PREFIX}/reference`,
    apiReference({
      theme: 'purple',
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
