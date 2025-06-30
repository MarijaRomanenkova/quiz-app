import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { hash, compare } from 'bcrypt';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { verificationEmailTemplate } from '../templates/email/verification.template';
import { passwordResetTemplate } from '../templates/email/password-reset.template';
import { UserPayload } from '../types/user.types';

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
    const { email, password, username, studyPaceId, agreedToTerms } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.findUser({ email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const hashedPassword = await hash(password, 10);

      // Generate verification token
      const verificationToken = randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user with preferences
      const user = await this.prisma.createUser({
        email,
        username,
        password: hashedPassword,
        studyPaceId,
        agreedToTerms,
        marketingEmails: false, // Default to false
        shareDevices: false, // Default to false
        verificationToken,
        verificationTokenExpires,
        level: {
          connect: {
            levelId: 'A1.1'
          }
        }
      });

      // Send verification email
      await this.sendVerificationEmail(user.email, verificationToken);

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
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
    user: { 
      id: string; 
      email: string; 
      username: string; 
      levelId: string;
      studyPaceId: number;
      agreedToTerms: boolean;
      marketingEmails: boolean;
      shareDevices: boolean;
    };
  }> {
    const { email, password } = loginDto;

    const user = await this.prisma.findUser({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload: UserPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        levelId: user.levelId,
        studyPaceId: user.studyPaceId,
        agreedToTerms: user.agreedToTerms,
        marketingEmails: user.marketingEmails,
        shareDevices: user.shareDevices,
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
      throw new Error('BACKEND_URL environment variable is not set');
    }
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!senderEmail) {
      throw new Error('SENDER_EMAIL environment variable is not set');
    }

    try {
      await this.resend.emails.send({
        from: senderEmail,
        to: email,
        subject: 'Welcome to Quiz App - Verify Your Email',
        html: verificationEmailTemplate(verificationUrl),
      });
    } catch (error) {
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
    } catch (error) {
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

  async getUserProfile(userId: string) {
    const user = await this.prisma.findUser({ id: userId });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      levelId: user.levelId,
      studyPaceId: user.studyPaceId,
      agreedToTerms: user.agreedToTerms,
      marketingEmails: user.marketingEmails,
      shareDevices: user.shareDevices,
      emailVerified: user.emailVerified,
    };
  }

  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.findUser({ id: userId });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.updateUser(
      { id: userId },
      {
        studyPaceId: updateProfileDto.studyPaceId,
        marketingEmails: updateProfileDto.marketingEmails,
        shareDevices: updateProfileDto.shareDevices,
      },
    );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      levelId: updatedUser.levelId,
      studyPaceId: updatedUser.studyPaceId,
      agreedToTerms: updatedUser.agreedToTerms,
      marketingEmails: updatedUser.marketingEmails,
      shareDevices: updatedUser.shareDevices,
      emailVerified: updatedUser.emailVerified,
    };
  }

  async deleteUserAccount(userId: string) {
    const user = await this.prisma.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user and all related data
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }

  /**
   * Load statistics data for a user (called on login)
   * 
   * Retrieves the user's statistics (quiz time and completed topics) from the database
   * to sync with the mobile app's Redux state.
   * 
   * @param userId - User ID to load statistics data for
   * @returns Promise containing statistics data
   */
  async loadStatisticsData(userId: string) {
    const statistics = await this.prisma.statistics.findUnique({
      where: { userId }
    });
    
    if (!statistics) {
      // Return default values if no statistics exist
      return {
        totalQuizMinutes: 0,
        dailyQuizTimes: [],
        completedTopics: []
      };
    }

    return {
      totalQuizMinutes: statistics.totalQuizMinutes || 0,
      dailyQuizTimes: statistics.dailyQuizTimes || [],
      completedTopics: statistics.completedTopics || []
    };
  }

  /**
   * Sync statistics data for a user (called on logout)
   * 
   * Updates the user's statistics (quiz time and completed topics) in the database
   * with data from the mobile app's Redux state.
   * 
   * @param userId - User ID to sync statistics data for
   * @param statisticsData - Statistics data from Redux state
   * @returns Promise indicating successful sync
   */
  async syncStatisticsData(userId: string, statisticsData: {
    totalQuizMinutes: number;
    dailyQuizTimes: any[];
    completedTopics?: any[];
  }) {
    const { totalQuizMinutes, dailyQuizTimes, completedTopics = [] } = statisticsData;

    // Check if statistics record exists
    const existingStats = await this.prisma.statistics.findUnique({
      where: { userId }
    });

    if (existingStats) {
      // Update existing statistics
      await this.prisma.statistics.update({
        where: { userId },
        data: {
          totalQuizMinutes,
          dailyQuizTimes,
          completedTopics
        }
      });
    } else {
      // Create new statistics record
      await this.prisma.statistics.create({
        data: {
          userId,
          totalQuizMinutes,
          dailyQuizTimes,
          completedTopics,
          totalQuizzes: 0,
          correctAnswers: 0,
          totalQuestions: 0,
          averageScore: 0
        }
      });
    }

    return { message: 'Statistics data synced successfully' };
  }
}
