import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class IntegrationsService {
  private telexWebhookUrl: string;
  public telexConfig: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.telexWebhookUrl = this.configService.get<string>('TELEX_WEBHOOK_URL');

    // Load JSON configuration
    const filePath = path.join(__dirname, '../../src/config/telex.json');
    this.telexConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  async sendToTelex(eventData: any) {
    console.log('Received Asana event:', eventData);

    const payload = {
      ...this.telexConfig.data, // Include Telex integration metadata
      event: eventData, // Append event data
      status: 'success'
};

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.telexWebhookUrl, payload)
      );
      console.log('Data successfully sent to Telex:', response.status);
    } catch (error) {
      console.error('Error sending data to Telex:', error.message);
    }
  }
}
