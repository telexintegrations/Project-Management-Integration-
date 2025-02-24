import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { IntegrationsService } from './integration.service';

@Controller('integration')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @HttpCode(200) 
  async handleAsanaWebhook(@Body() eventData: any) {
    console.log('Received Asana event:', eventData);

    await this.integrationsService.sendToTelex(eventData);
  }
}
