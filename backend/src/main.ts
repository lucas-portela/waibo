import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Waibo API')
    .setDescription('Whatsapp AI Bot API')
    .setVersion(process.env.VERSION ?? '1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addSecurityRequirements('access-token', ['bearer'])
    .build();

  // Remove auth requirements from public endpoints in Swagger
  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config);
    Object.values(document.paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (
          Array.isArray(method.security) &&
          method.security.find((s) => Object.keys(s).includes('public'))
        ) {
          method.security = [];
        }
      });
    });
    return document;
  };
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
