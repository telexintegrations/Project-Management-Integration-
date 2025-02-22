import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async authenticate(@Query('code') code: string) {
    try {
      return await this.authService.exchangeCodeForToken(code);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}