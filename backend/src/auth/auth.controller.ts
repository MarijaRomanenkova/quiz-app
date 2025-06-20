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
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { verificationSuccessTemplate } from '../templates/email/verification-success.template';
import { ConfigService } from '@nestjs/config';
import { resetPasswordPageTemplate } from '../templates/email/reset-password.template';

interface UserPayload {
  sub: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login request received for email: ${loginDto.email}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Login successful for: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}: ${error.message}`);
      throw error;
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    await this.authService.verifyEmail(token);
    const mobileUrl = this.configService.get<string>('MOBILE_URL');
    res.send(verificationSuccessTemplate(mobileUrl));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: UserPayload }) {
    return req.user;
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
    res.send(resetPasswordPageTemplate(mobileUrl));
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
