import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setup = (app: any) => {
  app.enableCors({ origin: true });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useWebSocketAdapter(new WsAdapter(app));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('auth refresh token post API')
    .setDescription('The auth refresh token post API description')
    .setVersion('1.0')
    .addTag('boilerplate')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  return app;
};
