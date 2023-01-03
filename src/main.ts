import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './common/exception/query-exception-filter';
import { HttpExceptionFilter } from './common/exception/http-exception-filter';
import { AllExceptionsFilter } from './common/exception/all-exception-filter';

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
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter(), new QueryFailedFilter(),
  )
  app.enableCors();
  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)

}
bootstrap();
