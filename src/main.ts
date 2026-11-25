
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
  .setTitle('Campus Events API')
  .setDescription('API documentation for the Campus Events application')
  .setVersion('1.0')
  .addApiKey(
    {
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    },
    'api-key',
  )
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
  useGlobalPrefix: true,
});

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
