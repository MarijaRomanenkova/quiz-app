import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsNumber, IsBoolean, Min, Max } from 'class-validator';

/**
 * Data Transfer Object for user registration requests
 *
 * This DTO defines the structure and validation rules for user registration.
 * It ensures that all required fields are provided and meet validation requirements.
 *
 * @class RegisterDto
 *
 * @example
 * ```typescript
 * // Valid registration request
 * const registerData: RegisterDto = {
 *   email: 'user@example.com',
 *   password: 'password123',
 *   username: 'john_doe',
 *   studyPaceId: 2,
 *   agreedToTerms: true
 * };
 * ```
 */
export class RegisterDto {
  /**
   * User's email address
   *
   * Must be a valid email format and is required for account creation.
   * This email will be used for login and account verification.
   *
   * @example 'user@example.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * User's chosen username
   *
   * Must be a non-empty string and is required for account creation.
   * This username will be displayed in the application.
   *
   * @example 'john_doe'
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  /**
   * User's preferred study pace ID
   *
   * Must be a number between 1 and 3 representing the study pace level.
   * 1 = Relaxed, 2 = Moderate, 3 = Intensive
   *
   * @example 2
   */
  @IsNumber()
  @Min(1)
  @Max(3)
  studyPaceId: number;

  /**
   * User's agreement to terms and conditions
   *
   * Must be true for registration to proceed.
   *
   * @example true
   */
  @IsBoolean()
  agreedToTerms: boolean;
}
