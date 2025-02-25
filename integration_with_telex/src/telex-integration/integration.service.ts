import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IntegrationService {
  private readonly telexWebhookUrl: string;
  private readonly logger = new Logger(IntegrationService.name);

  constructor() {
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
          app_name: 'Project Management',
          app_description: 'Telex real-time notification provider.',
          app_logo:
            'https://logos-world.net/wp-content/uploads/2021/03/Asana-Logo.png',
          app_url: 'https://project-management-integration-yr2i.onrender.com',
          background_color: '#3498db',
        },
        is_active: true,
        integration_type: 'output',
        integration_category: 'Communication & Collaboration',
        output: [
          { label: 'asana_notifications', value: true },
          { label: 'slack_notifications', value: false },
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
          { label: 'interval', type: 'text', required: true, default: '*/5 * * * *' },
          { label: 'Key', type: 'text', required: true, default: 'ABC123456789' },
          { label: 'Do you want to continue', type: 'checkbox', required: true, default: 'Yes' },
          { label: 'Provide Speed', type: 'number', required: true, default: 1000 },
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
        target_url:
          process.env.TELEX_WEBHOOK_URL ||
          'https://ping.telex.im/v1/webhooks/019520bd-a6f6-7664-86d4-1eb140e84342',
        tick_url:
          process.env.TICK_URL ||
          'https://project-management-integration-yr2i.onrender.com',
      },
    };
  }

  async sendToTelex(payload: any) {
    try {
      const formattedPayload = {
        event_name: 'task',
        username: 'BigLens',
        status: 'status',
        data: payload.data || {},
      };

      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Telex-Integration-Service/1.0',
        Authorization: `Bearer ${process.env.TELEX_API_KEY || ''}`, 
      };

      this.logger.log(`Sending request to Telex: ${this.telexWebhookUrl}`);
      this.logger.debug(`Payload: ${JSON.stringify(formattedPayload)}`);

      const response = await axios.post(this.telexWebhookUrl, formattedPayload, {
        headers,
        timeout: 5000, 
      });

      this.logger.log('Successfully sent event to Telex');
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to send data to Telex: ${error.response?.data?.message || error.message}`,
      );
      throw new Error('Telex notification failed');
    }
  }
}
