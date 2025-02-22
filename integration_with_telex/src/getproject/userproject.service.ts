import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
  private readonly asanaApiUrl = 'https://app.asana.com/api/1.0';

  constructor(private readonly configService: ConfigService) {}

  async getProjects() {
    try {
      const accessToken = this.configService.get<string>('ASANA_ACCESS_TOKEN');
      if (!accessToken) {
        throw new HttpException('Access token not found', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.get(`${this.asanaApiUrl}/projects`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
