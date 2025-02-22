import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                ASANA_CLIENT_ID: 'test-client-id',
                ASANA_CLIENT_SECRET: 'test-client-secret',
                ASANA_REDIRECT_URI: 'http://localhost/callback',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for token successfully', async () => {
      const mockResponse = {
        data: { access_token: 'test-access-token', refresh_token: 'test-refresh-token' },
      };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.exchangeCodeForToken('test-code');

      expect(result).toEqual({ message: 'Authentication successful', access_token: 'test-access-token' });
      expect(authService.getAccessToken()).toBe('test-access-token');
      expect(authService.getRefreshToken()).toBe('test-refresh-token');
    });

    it('should throw error if code is missing', async () => {
      await expect(authService.exchangeCodeForToken('')).rejects.toThrow(HttpException);
      await expect(authService.exchangeCodeForToken('')).rejects.toThrow('Authorization code is missing');
    });

    it('should throw error if request fails', async () => {
      (axios.post as jest.Mock).mockRejectedValue({ response: { data: 'Invalid code' } });
      
      await expect(authService.exchangeCodeForToken('invalid-code')).rejects.toThrow(HttpException);
      await expect(authService.exchangeCodeForToken('invalid-code')).rejects.toThrow('Invalid code');
    });
  });
});
