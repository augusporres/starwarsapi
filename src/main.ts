import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Star Wars API Documentation')
    .setDescription('Star Wars API')
    .setVersion('1.0')
    .addBearerAuth(
        {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'},
        'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/v1/swagger', app, document);
  SwaggerModule.setup('api/v1/swagger', app, document, {
    swaggerUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@latest/',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap()