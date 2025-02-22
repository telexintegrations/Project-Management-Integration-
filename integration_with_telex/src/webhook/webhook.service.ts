import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly configService: ConfigService) {}

  // Store X-Hook-Secret securely (can be stored in DB instead of env)
  storeSecret(secret: string) {
    process.env.X_HOOK_SECRET = secret;
    this.logger.log(`X-Hook-Secret stored securely.`);
  }

  // Validate signature to ensure request integrity
  validateSignature(receivedSignature: string, payload: any): boolean {
    const storedSecret = process.env.X_HOOK_SECRET || '';
    if (!storedSecret) {
      this.logger.error('X-Hook-Secret is missing.');
      return false;
    }

    const computedSignature = crypto
      .createHmac('SHA256', storedSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(computedSignature),
    );
  }

  // Process the webhook event (can be extended)
  async processEvent(payload: any) {
    this.logger.log(`Received Webhook Event: ${JSON.stringify(payload, null, 2)}`);
    // Handle the event (e.g., store in DB, trigger actions)
  }
}
