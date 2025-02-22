import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';


//business logic here
@Injectable()
export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async exchangeCodeForToken(code: string) {
    if (!code) {
      throw new HttpException('Authorization code is missing', HttpStatus.BAD_REQUEST);
    }

    try {
      const qs = new URLSearchParams();
      qs.append('grant_type', 'authorization_code');
      qs.append('client_id', this.configService.get<string>('ASANA_CLIENT_ID'));
      qs.append('client_secret', this.configService.get<string>('ASANA_CLIENT_SECRET'));
      qs.append('redirect_uri', this.configService.get<string>('ASANA_REDIRECT_URI'));
      qs.append('code', code);

      const response = await axios.post('https://app.asana.com/-/oauth_token', qs.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      return { message: 'Authentication successful', access_token: this.accessToken };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to get access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}