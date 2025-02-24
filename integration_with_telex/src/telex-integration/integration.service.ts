import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private readonly telexWebhookUrl: string;
  private telexConfig: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.telexWebhookUrl = this.configService.get<string>('TELEX_WEBHOOK_URL')

    // Load JSON configuration
    const filePath = path.resolve(__dirname, '../../src/config/integration.json');
    if (fs.existsSync(filePath)) {
      this.telexConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      this.logger.warn('integration.json not found, using default values.');
      this.telexConfig = { message: 'Configuration file missing' };
    }
  }

  getIntegrationConfig() {
    return this.telexConfig;
  }

  async sendToTelex(eventData: any) {
    this.logger.log('Sending event to Telex:', JSON.stringify(eventData));

    const payload = {
      ...this.telexConfig?.data, // Include integration metadata
      event: eventData, // Append event data
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.telexWebhookUrl, payload)
      );
      this.logger.log(`Data successfully sent to Telex: ${response.status}`);
    } catch (error) {
      this.logger.error(`Error sending data to Telex: ${error.message}`);
    }
  }
}
