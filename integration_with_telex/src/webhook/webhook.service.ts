import { Injectable, Logger } from '@nestjs/common';
import { WebhookEventDto } from './webhookevent.dto';
import { IntegrationService } from '../telex-integration/integration.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly integrationsService: IntegrationService) {}

  async processWebhookEvent(payload: WebhookEventDto) {
    const { events } = payload;

    if (!events || events.length === 0) {
      this.logger.warn('No webhook events received.');
      return;
    }

    for (const event of events) {
      this.logger.log(`Processing Webhook Event: ${JSON.stringify(event, null, 2)}`);

      // Send event to Telex
      try {
        await this.integrationsService.sendToTelex(event);
        this.logger.log('Successfully sent event to Telex');
      } catch (error) {
        this.logger.error('Failed to send event to Telex', error);
      }

      switch (event.resource.resource_type) {
        case 'project':
          this.handleProjectEvent(event.action, event.resource.gid, event.change);
          break;
        case 'task':
          this.handleTaskEvent(event.action, event.resource.gid, event.change);
          break;
        case 'milestone':
          this.handleMilestoneEvent(event.action, event.resource.gid, event.change);
          break;
        default:
          this.logger.warn(`Unhandled resource type: ${event.resource.resource_type}`);
      }
    }
  }

  private handleProjectEvent(action: string, gid: string, change?: any) {
    if (change?.field === 'name') this.logger.log(`Project name changed: ${gid}`);
    if (change?.field === 'notes') this.logger.log(`Project description updated: ${gid}`);
    if (change?.field === 'due_date') this.logger.log(`Project due date changed: ${gid}`);
  }

  private handleTaskEvent(action: string, gid: string, change?: any) {
    if (action === 'added') this.logger.log(`Task added: ${gid}`);
    if (action === 'removed') this.logger.log(`Task removed: ${gid}`);
    if (change?.field === 'completed') this.logger.log(`Task completed: ${gid}`);
    if (change?.field === 'assignee') this.logger.log(`Task assigned: ${gid}`);
    if (change?.field === 'notes') this.logger.log(`Task description updated: ${gid}`);
    if (change?.field === 'due_date') this.logger.log(`Task due date updated: ${gid}`);
  }

  private handleMilestoneEvent(action: string, gid: string, change?: any) {
    if (action === 'added') this.logger.log(`Milestone added: ${gid}`);
    if (action === 'removed') this.logger.log(`Milestone removed: ${gid}`);
    if (change?.field === 'name') this.logger.log(`🔹 Milestone name changed: ${gid}`);
    if (change?.field === 'due_date') this.logger.log(`Milestone due date changed: ${gid}`);
    if (change?.field === 'completed') this.logger.log(`Milestone marked as completed: ${gid}`);
  }
}

