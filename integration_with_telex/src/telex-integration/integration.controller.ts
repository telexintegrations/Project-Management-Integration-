import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { IntegrationsService } from './integration.service';

@Controller('integration.json')
export class IntegrationsController {
  private readonly logger = new Logger(IntegrationsController.name);

  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  getIntegrationConfig() {
    return this.integrationsService.getIntegrationConfig();
  }

  @Post()
  async sendEventToTelex(@Body() eventData: any) {
    this.logger.log(` Received event: ${JSON.stringify(eventData)}`);
    await this.integrationsService.sendToTelex(eventData);
    return { message: 'Event sent to Telex' };
  }
}


