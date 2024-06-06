import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Solo valida propiedades que tienen decoradores de validacion
    forbidNonWhitelisted: true, // Lanza error si se reciben props adicionales
    transform: true, // Transforma automaticamente los objetos planos en instancias de clases
    disableErrorMessages: false // Muestra mensajes de error detallados
  }))

  await app.listen(port);
  Logger.log(`Running on: http://localhost:${port}`, "URL")
}
bootstrap();
