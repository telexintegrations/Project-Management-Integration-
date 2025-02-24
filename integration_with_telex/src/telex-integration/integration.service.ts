import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IntegrationsService {
  private telexWebhookUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.telexWebhookUrl = this.configService.get<string>('TELEX_WEBHOOK_URL');
  }

  async sendToTelex(data: any) {
    console.log('Forwarding data to Telex:', data);

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.telexWebhookUrl, data)
      );
      console.log('Data successfully sent to Telex:', response.status);
    } catch (error) {
      console.error('Error sending data to Telex:', error.message);
    }
  }
}
