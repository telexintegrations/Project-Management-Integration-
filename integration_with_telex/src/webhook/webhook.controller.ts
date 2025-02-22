import {
    Controller,
    Post,
    Headers,
    Body,
    Res,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { WebhookService } from './webhook.service';
  
  @Controller('webhook')
  export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}
  
    @Post('receive')
    async handleWebhook(
      @Headers('x-hook-secret') hookSecret: string,
      @Headers('x-hook-signature') hookSignature: string,
      @Body() payload: any,
      @Res() res: Response,
    ) {
      if (hookSecret) {
        // Step 1: Handshake Verification (respond with the X-Hook-Secret)
        this.webhookService.storeSecret(hookSecret);
        res.setHeader('X-Hook-Secret', hookSecret);
        return res.status(HttpStatus.OK).send();
      }
  
      if (hookSignature) {
        // Step 2: Validate Signature
        const isValid = this.webhookService.validateSignature(hookSignature, payload);
        if (!isValid) {
          return res.status(HttpStatus.UNAUTHORIZED).send();
        }
  
        // Step 3: Process Event Data
        await this.webhookService.processEvent(payload);
        return res.status(HttpStatus.OK).json({ message: 'Webhook processed' });
      }
  
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid request' });
    }
  }
  