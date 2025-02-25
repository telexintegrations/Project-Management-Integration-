export class WebhookEventDto {
    events: {
      user: { gid: string; resource_type: string };
      created_at: string;
      action: string;
      resource: { gid: string; resource_type: string };
      parent?: any;
      change?: { field: string; action: string };
    }[];
  }