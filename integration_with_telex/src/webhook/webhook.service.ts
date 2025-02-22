import { Injectable, Logger } from '@nestjs/common';
import { WebhookEventDto } from './webhookevent.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  processWebhookEvent(payload: WebhookEventDto) {
    const { events } = payload;

    if (!events || events.length === 0) {
      this.logger.warn('No webhook events received.');
      return;
    }

    for (const event of events) {
      const { action, resource, change } = event;

      this.logger.log(`Webhook Event: ${JSON.stringify(event, null, 2)}`);

      switch (resource.resource_type) {
        case 'project':
          this.handleProjectEvent(action, resource.gid, change);
          break;
        case 'task':
          this.handleTaskEvent(action, resource.gid, change);
          break;
        case 'milestone':
          this.handleMilestoneEvent(action, resource.gid, change);
          break;
        default:
          this.logger.warn(`Unhandled resource type: ${resource.resource_type}`);
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
    if (change?.field === 'name') this.logger.log(`Milestone name changed: ${gid}`);
    if (change?.field === 'due_date') this.logger.log(`Milestone due date changed: ${gid}`);
    if (change?.field === 'completed') this.logger.log(`Milestone marked as completed: ${gid}`);
  }
}
