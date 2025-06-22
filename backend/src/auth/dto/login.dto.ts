import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for user login requests
 *
 * This DTO defines the structure and validation rules for login requests.
 * It ensures that the email is valid and the password meets minimum requirements.
 *
 * @class LoginDto
 *
 * @example
 * ```typescript
 * // Valid login request
 * const loginData: LoginDto = {
 *   email: 'user@example.com',
 *   password: 'password123'
 * };
 * ```
 */
export class LoginDto {
  /**
   * User's email address
   *
   * Must be a valid email format and is required for authentication.
   *
   * @example 'user@example.com'
   */
  @IsEmail()
  email: string;

  /**
   * User's password
   *
   * Must be a string with minimum length of 6 characters.
   *
   * @example 'password123'
   */
  @IsString()
  @MinLength(6)
  password: string;
}
