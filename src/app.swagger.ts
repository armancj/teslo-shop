import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { EnvNameEnum } from './config';

export function AppSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle('Tesla Shop - API Documentation')
    .setDescription('The documentation Tesla Shop ')
    .setVersion('0.1')
    //.addTag('Tesla Shop Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get(EnvNameEnum.SWAGGER_PREFIX),
    app,
    document,
  );
}
