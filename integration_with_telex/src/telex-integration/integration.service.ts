import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IntegrationService {
  private readonly telexWebhookUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.telexWebhookUrl =
      process.env.TELEX_WEBHOOK_URL ||
      'https://ping.telex.im/v1/webhooks/0195186d-b707-7f9e-bc7f-c75f841ef281';
  }

  getIntegrationJson() {
    return {
      data: {
        date: {
          created_at: '2025-02-24',
          updated_at: '2025-02-24',
        },
        descriptions: {
          app_name: 'Asana',
          app_description: 'Telex real-time notification provider.',
          app_logo:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fasana.com%2Fbrand&psig=AOvVaw1HJoQTAnGtHfri4Jgjwx7I&ust=1740498804043000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCICa9rnV3IsDFQAAAAAdAAAAABAE',
          app_url: 'https://app.asana.com',
          background_color: '#3498db',
        },
        is_active: true,
        integration_type: 'output',
        integration_category: 'Communication & Collaboration',
        output: [
          {
            label: 'asana_notifications',
            value: true,
          },
          {
            label: 'slack_notifications',
            value: false,
          },
        ],
        key_features: [
          'Real-time notifications.',
          'Seamless integration with Asana.',
          'Supports multiple notification channels.',
          'Customizable notification settings.',
        ],
        permissions: {
          monitoring_user: {
            always_online: true,
            display_name: 'Telex Monitor',
          },
        },
        settings: [
          {
            label: 'interval',
            type: 'text',
            required: true,
            default: '*/5 * * * *',
          },
          {
            label: 'Key',
            type: 'text',
            required: true,
            default: 'ABC123456789',
          },
          {
            label: 'Do you want to continue',
            type: 'checkbox',
            required: true,
            default: 'Yes',
          },
          {
            label: 'Provide Speed',
            type: 'number',
            required: true,
            default: 1000,
          },
          {
            label: 'Sensitivity Level',
            type: 'dropdown',
            required: true,
            default: 'Low',
            options: ['High', 'Low'],
          },
          {
            label: 'Alert Admin',
            type: 'multi-checkbox',
            required: true,
            default: 'Super-Admin',
            options: ['Super-Admin', 'Admin', 'Manager', 'Developer'],
          },
        ],
        target_url: process.env.TELEX_WEBHOOK_URL || 'https://ping.telex.im/v1/webhooks/019520bd-a6f6-7664-86d4-1eb140e84342',
        tick_url: process.env.TICK_URL || 'https://project-management-integration-yr2i.onrender.com'
      },
    };
  }

  async sendToTelex(payload: any) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(this.telexWebhookUrl, payload),
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send data to Telex:', error.message);
      throw new Error('Telex notification failed');
    }
  }
}
