import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './userproject.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects() {
    return this.projectService.getProjects();
  }
}
