import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { ConfigModule } from '@nestjs/config';
import { IntegrationService } from 'src/telex-integration/integration.service';
import { HttpModule} from '@nestjs/axios';
import { IntegrationController } from 'src/telex-integration/integration.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [WebhookController, IntegrationController],
  providers: [WebhookService, IntegrationService],
})
export class WebhookModule {}
