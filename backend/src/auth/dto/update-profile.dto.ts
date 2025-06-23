import { IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

/**
 * Data Transfer Object for updating user profile preferences
 *
 * This DTO defines the structure and validation rules for updating user preferences
 * such as study pace, marketing emails, and device sharing.
 *
 * @class UpdateProfileDto
 *
 * @example
 * ```typescript
 * // Valid profile update request
 * const updateData: UpdateProfileDto = {
 *   studyPaceId: 2,
 *   marketingEmails: true,
 *   shareDevices: false
 * };
 * ```
 */
export class UpdateProfileDto {
  /**
   * User's preferred study pace ID
   *
   * Must be a number between 1 and 3 representing the study pace level.
   * 1 = Relaxed, 2 = Moderate, 3 = Intensive
   *
   * @example 2
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  studyPaceId?: number;

  /**
   * User's preference for marketing emails
   *
   * Boolean indicating whether the user wants to receive marketing emails.
   *
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  /**
   * User's preference for sharing data across devices
   *
   * Boolean indicating whether the user wants to share their data across devices.
   *
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  shareDevices?: boolean;
} 
