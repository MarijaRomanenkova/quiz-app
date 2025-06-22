import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from 'bcrypt';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { verificationEmailTemplate } from '../templates/email/verification.template';
import { passwordResetTemplate } from '../templates/email/password-reset.template';
import { Prisma, User } from '@prisma/client';

interface UserPayload {
  sub: string;
  email: string;
}

/**
 * Authentication service that handles user authentication and authorization
 * 
 * This service provides business logic for:
 * - User registration with password hashing
 * - User login with credential validation
 * - JWT token generation and validation
 * - Email verification handling
 * 
 * @service AuthService
 * 
 * @example
 * ```typescript
 * // Register a new user
 * const result = await authService.register({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   username: 'username'
 * });
 * 
 * // Login user
 * const token = await authService.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
@Injectable()
export class AuthService {
  private resend: Resend;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Register a new user account
   * 
   * Creates a new user with hashed password and sends verification email.
   * The user must verify their email before they can log in.
   * 
   * @param registerDto - User registration data
   * @returns Promise containing success message
   * @throws ConflictException if user already exists
   * 
   * @example
   * ```typescript
   * try {
   *   await authService.register({
   *     email: 'user@example.com',
   *     password: 'password123',
   *     username: 'username'
   *   });
   *   // User registered successfully
   * } catch (error) {
   *   // Handle registration error
   * }
   * ```
   */
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, username } = registerDto;
    this.logger.log(`Registration attempt for email: ${email}`);

    // Check if user exists
    const existingUser = await this.prisma.findUser({ email });

    if (existingUser) {
      this.logger.warn(`Registration failed - User already exists: ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const hashedPassword = await hash(password, 10);

      // Generate verification token
      const verificationToken = randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await this.prisma.createUser({
        email,
        username,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        level: {
          connect: {
            levelId: 'A1.1'
          }
        }
      });

      this.logger.log(`User created successfully: ${email}`);

      // Send verification email
      await this.sendVerificationEmail(user.email, verificationToken);
      this.logger.log(`Verification email sent to: ${email}`);

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      this.logger.error(`Registration failed for ${email}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authenticate user and generate JWT token
   * 
   * Validates user credentials and returns a JWT access token if authentication
   * is successful. The token can be used for accessing protected endpoints.
   * 
   * @param loginDto - User login credentials
   * @returns Promise containing access token and user information
   * @throws UnauthorizedException if credentials are invalid
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await authService.login({
   *     email: 'user@example.com',
   *     password: 'password123'
   *   });
   *   // result.access_token contains the JWT token
   * } catch (error) {
   *   // Handle authentication error
   * }
   * ```
   */
  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    user: { id: string; email: string; username: string; levelId: string };
  }> {
    const { email, password } = loginDto;
    this.logger.log(`Login attempt for email: ${email}`);

    const user = await this.prisma.findUser({ email });
    this.logger.log(`User found: ${user ? 'yes' : 'no'}`);

    if (!user) {
      this.logger.warn(`Login failed - User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    this.logger.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed - Invalid password for: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Email verified status: ${user.emailVerified}`);

    if (!user.emailVerified) {
      this.logger.warn(`Login failed - Email not verified for: ${email}`);
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload: UserPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    this.logger.log(`Login successful for: ${email}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        levelId: user.levelId,
      },
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.prisma.findUser({ verificationToken: token });

    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    if (
      user.verificationTokenExpires &&
      user.verificationTokenExpires < new Date()
    ) {
      throw new UnauthorizedException('Verification token has expired');
    }

    await this.prisma.updateUser(
      { id: user.id },
      {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    );

    return { message: 'Email verified successfully' };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      this.logger.error('BACKEND_URL environment variable is not set');
      throw new Error('BACKEND_URL environment variable is not set');
    }
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!senderEmail) {
      this.logger.error('SENDER_EMAIL environment variable is not set');
      throw new Error('SENDER_EMAIL environment variable is not set');
    }

    try {
      await this.resend.emails.send({
        from: senderEmail,
        to: email,
        subject: 'Welcome to Quiz App - Verify Your Email',
        html: verificationEmailTemplate(verificationUrl),
      });
      this.logger.log(`Verification email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}: ${error.message}`);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.findUser({ email });

    if (!user) {
      // Don't reveal if the email exists or not
      return;
    }

    // Generate a random token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save the token to the database
    await this.prisma.updateUser(
      { email },
      {
        resetToken,
        resetTokenExpiry,
      },
    );

    // Generate the reset link
    const resetLink = `${process.env.BACKEND_URL}/api/auth/reset-password/${resetToken}`;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!senderEmail) {
      this.logger.error('SENDER_EMAIL environment variable is not set');
      throw new Error('SENDER_EMAIL environment variable is not set');
    }

    try {
      // Send the email using Resend
      await this.resend.emails.send({
        from: senderEmail,
        to: email,
        subject: 'Reset Your Password',
        html: passwordResetTemplate(resetLink),
      });
      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
      throw error;
    }
  }

  async verifyResetToken(token: string) {
    const user = await this.prisma.findUser({ resetToken: token });
    if (user && user.resetTokenExpiry && user.resetTokenExpiry > new Date()) {
      return user;
    }
    return null;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.verifyResetToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await this.prisma.updateUser(
      { id: user.id },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    );
  }
}
