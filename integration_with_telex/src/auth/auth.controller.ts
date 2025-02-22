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


// import { Body, Controller, Get, Post, Query, Headers, Res } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { Request, Response } from 'express';


// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Get('callback')
//   async handleRedirect(@Query('code') code: string) {
//     console.log('Authorization Code:', code);
//     return this.authService.exchangeCodeForToken(code);
//   }

//   @Get('me')
// async getUserInfo() {
//   return this.authService.getUserInfo();
// }

//   @Get('workspaces')
// async getWorkspaces() {
//   return this.authService.getWorkspaces();
// }

//   }


