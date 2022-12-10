import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
    })
  );
  app.enableCors();
  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)

}
bootstrap();
