import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ProjectController } from './getproject/userproject.controller';
import { ProjectService } from './getproject/userproject.service';
import { WebhookModule } from './webhook/webhook.module';
import { HttpModule } from '@nestjs/axios';
import { IntegrationController } from './telex-integration/integration.controller';
import { IntegrationService } from './telex-integration/integration.service';

@Module({
  imports: [ConfigModule.forRoot(), WebhookModule, HttpModule],
  controllers: [ProjectController, AuthController, IntegrationController],
  providers: [ProjectService, AuthService, IntegrationService],
  exports: [AuthService], 
})
export class AppModule {}

