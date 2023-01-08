import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './common/exception/query-exception-filter';
import { HttpExceptionFilter } from './common/exception/http-exception-filter';
import { AllExceptionsFilter } from './common/exception/all-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Booststrap')
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),

  );
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter(), new QueryFailedFilter())
  const config = new DocumentBuilder()
    .setTitle('Login RESTFul API')
    .setDescription('Proyect-Login endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)

}
bootstrap();
