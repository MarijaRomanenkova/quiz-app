import { IsEmail, IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';

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
 *   username: 'john_doe'
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
}
