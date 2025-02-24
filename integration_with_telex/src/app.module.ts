import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ProjectController } from './getproject/userproject.controller';
import { ProjectService } from './getproject/userproject.service';
import { WebhookModule } from './webhook/webhook.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), WebhookModule, HttpModule],
  controllers: [ProjectController, AuthController],
  providers: [ProjectService, AuthService],
  exports: [AuthService], 
})
export class AppModule {}

