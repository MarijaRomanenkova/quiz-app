import { z } from 'zod';

/**
 * Shared validation schemas for the mobile application
 * 
 * This module centralizes all form validation logic to eliminate duplication
 * and ensure consistency across the app. All schemas use Zod for type-safe validation.
 * 
 * @module utils/validationSchemas
 */

/**
 * Common password validation rules
 * 
 * Defines the standard password requirements used across the app:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter  
 * - At least one number
 * - At least one special character
 */
const passwordValidation = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Email validation schema
 * 
 * Standard email format validation used across all forms.
 */
export const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Login form validation schema
 * 
 * Validates email and password for login forms.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordValidation,
});

/**
 * Registration form validation schema
 * 
 * Comprehensive validation for user registration including:
 * - Name validation
 * - Email validation
 * - Password validation with confirmation
 * - Terms agreement requirement
 * - Study pace selection
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordValidation,
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Conditions',
  }),
  studyPaceId: z.number().min(1, 'Please select a study pace'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Forgot password form validation schema
 * 
 * Simple email validation for password recovery.
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Profile update validation schema
 * 
 * Validates user profile updates with optional fields.
 */
export const profileUpdateSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  studyPaceId: z.number().min(1).max(3).optional(),
  marketingEmails: z.boolean().optional(),
  shareDevices: z.boolean().optional(),
});

// Type exports for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>; 
