import { Controller, Get, Post, Body } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller()
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('integration-json')
  getIntegrationJson() {
    return this.integrationService.getIntegrationJson();
  }
}



