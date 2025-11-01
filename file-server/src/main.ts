import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions:{
        enableImplicitConversion:true,
      }
    }),
  );

  app.enableCors();
  const port = configService.get('port');
  await app.listen(port);
  console.log(`Application running on : http://localhost:${port}`);
  
}
bootstrap();
