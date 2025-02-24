import { Controller, Post, Headers, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from './webhook.service';
import { WebhookEventDto } from './webhookevent.dto';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('receive')
  async handleWebhook(
    @Headers('X-Hook-Secret') hookSecret: string,
    @Body() payload: WebhookEventDto,
    @Res() res: Response,
  ) {
    if (hookSecret) {
      this.logger.log('X-Hook-Secret received');
      res.setHeader('X-Hook-Secret', hookSecret);
      return res.status(200).send();
    }

    // Respond to Asana immediately before processing
    res.status(200).send();

    try {
      this.logger.log('Webhook received, processing in background...');
      await this.webhookService.processWebhookEvent(payload);
      this.logger.log('Webhook processing completed.');
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
    }
  }
}
