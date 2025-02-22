import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            exchangeCodeForToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call AuthService and return the auth response', async () => {
    const code = 'validAuthCode';
    const mockResponse = { message: 'Authentication successful', access_token: 'mockAccessToken' };

    jest.spyOn(authService, 'exchangeCodeForToken').mockResolvedValue(mockResponse);

    const result = await authController.authenticate(code);
    expect(result).toEqual(mockResponse);
    expect(authService.exchangeCodeForToken).toHaveBeenCalledWith(code);
  });

  it('should throw an HttpException when AuthService fails', async () => {
    const code = 'invalidAuthCode';
    const errorMessage = 'Failed to get access token';

    jest.spyOn(authService, 'exchangeCodeForToken').mockRejectedValue(new HttpException(errorMessage, HttpStatus.UNAUTHORIZED));

    await expect(authController.authenticate(code)).rejects.toThrow(HttpException);
  });
});
