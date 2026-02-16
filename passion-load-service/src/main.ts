import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // global error format
  app.useGlobalFilters(new HttpExceptionFilter());

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Passion Load Service')
    .setDescription('passion-load-service API')
    .setVersion('1.0.0')
    // Authorize 버튼에서 헤더 3개를 넣을 수 있게 등록
    .addApiKey(
      { type: 'apiKey', name: 'x-organization-id', in: 'header' },
      'org'
    )
    .addApiKey({ type: 'apiKey', name: 'x-user-role', in: 'header' }, 'role')
    .addApiKey({ type: 'apiKey', name: 'x-user-id', in: 'header' }, 'user')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document); // http://localhost:3000/docs

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}

bootstrap();
