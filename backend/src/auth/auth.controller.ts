import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
  Res,
  Logger,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { verificationSuccessTemplate } from '../templates/email/verification-success.template';
import { ConfigService } from '@nestjs/config';
import { resetPasswordSuccessTemplate } from '../templates/email/reset-password-success.template';
import { RequestUser } from '../types/user.types';

/**
 * Authentication controller that handles user registration and login
 * 
 * This controller provides endpoints for user authentication including:
 * - User registration with email verification
 * - User login with JWT token generation
 * 
 * All endpoints are public and do not require authentication.
 * 
 * @controller auth
 * @example
 * ```typescript
 * // Login
 * POST /auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * // Register
 * POST /auth/register
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "username": "username"
 * }
 * ```
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user account
   * 
   * Creates a new user account with email verification. The user will receive
   * a verification email and must verify their account before logging in.
   * 
   * @param registerDto - User registration data
   * @returns Promise indicating successful registration
   * 
   * @example
   * ```typescript
   * const result = await authController.register({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   username: 'username'
   * });
   * // Returns: { message: 'User registered successfully' }
   * ```
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  /**
   * Authenticate user and generate JWT access token
   * 
   * Validates user credentials and returns a JWT token for authenticated requests.
   * The token should be included in the Authorization header for protected endpoints.
   * 
   * @param loginDto - User login credentials
   * @returns Promise containing access token and user information
   * 
   * @example
   * ```typescript
   * const result = await authController.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * });
   * // Returns: { access_token: 'jwt_token', user: { id, email, username } }
   * ```
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    await this.authService.verifyEmail(token);
    const mobileUrl = this.configService.get<string>('MOBILE_URL');
    res.send(verificationSuccessTemplate(mobileUrl));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: RequestUser }) {
    return this.authService.getUserProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req: { user: RequestUser },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateUserProfile(req.user.id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account')
  async deleteAccount(@Request() req: { user: RequestUser }) {
    return this.authService.deleteUserAccount(req.user.id);
  }

  /**
   * Load quiz time data for the authenticated user
   * 
   * Retrieves the user's quiz time statistics from the database
   * to sync with the mobile app's Redux state on login.
   * 
   * @param req - Request object containing authenticated user
   * @returns Promise containing quiz time data
   * 
   * @example
   * ```typescript
   * const quizTimeData = await authController.loadQuizTimeData(req);
   * // Returns: { totalQuizMinutes: 120, dailyQuizTimes: [...] }
   * ```
   */
  @UseGuards(JwtAuthGuard)
  @Get('quiz-time')
  async loadQuizTimeData(@Request() req: { user: RequestUser }) {
    return this.authService.loadQuizTimeData(req.user.id);
  }

  /**
   * Sync quiz time data for the authenticated user
   * 
   * Updates the user's quiz time statistics in the database
   * with data from the mobile app's Redux state on logout.
   * 
   * @param req - Request object containing authenticated user
   * @param quizTimeData - Quiz time data from Redux state
   * @returns Promise indicating successful sync
   * 
   * @example
   * ```typescript
   * const result = await authController.syncQuizTimeData(req, {
   *   totalQuizMinutes: 120,
   *   dailyQuizTimes: [{ date: "2024-01-15", minutes: 30, lastUpdated: "..." }]
   * });
   * // Returns: { message: 'Quiz time data synced successfully' }
   * ```
   */
  @UseGuards(JwtAuthGuard)
  @Post('quiz-time')
  async syncQuizTimeData(
    @Request() req: { user: RequestUser },
    @Body() quizTimeData: {
      totalQuizMinutes: number;
      dailyQuizTimes: any[];
    }
  ) {
    return this.authService.syncQuizTimeData(req.user.id, quizTimeData);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<{ message: string }> {
    await this.authService.forgotPassword(email);
    return { message: 'If an account exists with this email, you will receive password reset instructions.' };
  }

  @Get('reset-password/:token')
  async showResetPasswordPage(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    try {
      // Verify token is valid
      const user = await this.authService.verifyResetToken(token);
      if (!user) {
        return res.status(400).send('Invalid or expired reset token');
      }

      // Show password reset form
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              margin-top: 50px;
            }
            .form-group {
              margin: 20px 0;
            }
            input {
              width: 100%;
              padding: 8px;
              margin: 5px 0;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            button {
              background-color: #4313E2;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .error {
              color: red;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <form id="resetForm" onsubmit="handleSubmit(event)">
              <div class="form-group">
                <label for="password">New Password</label>
                <input type="password" id="password" required minlength="6">
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" required minlength="6">
              </div>
              <div id="error" class="error"></div>
              <button type="submit">Reset Password</button>
            </form>
          </div>
          <script>
            async function handleSubmit(event) {
              event.preventDefault();
              const password = document.getElementById('password').value;
              const confirmPassword = document.getElementById('confirmPassword').value;
              const errorDiv = document.getElementById('error');
              
              if (password !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match';
                return;
              }
              
              try {
                const response = await fetch('/api/auth/reset-password/${token}', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ password }),
                });
                
                if (response.ok) {
                  window.location.href = '/api/auth/reset-password-success';
                } else {
                  const data = await response.json();
                  errorDiv.textContent = data.message || 'Failed to reset password';
                }
              } catch (error) {
                errorDiv.textContent = 'An error occurred. Please try again.';
              }
            }
          </script>
        </body>
        </html>
      `);
    } catch (error) {
      res.status(400).send('Invalid or expired reset token');
    }
  }

  @Get('reset-password-success')
  showResetPasswordSuccess(@Res() res: Response) {
    const mobileUrl = process.env.MOBILE_URL || 'quizapp://';
    res.send(resetPasswordSuccessTemplate(mobileUrl));
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    await this.authService.resetPassword(token, password);
    return { message: 'Password reset successful' };
  }
}
