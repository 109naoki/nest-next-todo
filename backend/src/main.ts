import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // アプリケーション全体でバリデーションパイプをグローバルに適用するために使用;
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // CORSを有効;
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  // クッキーをパース;
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
