import { User } from '@prisma/client';

/**
 * Custom user types for API responses, DTOs, and business logic
 *
 * This file defines TypeScript types and interfaces for user data structures
 * used throughout the backend, such as API responses, DTOs, and utility functions.
 *
 * @file user.types.ts
 *
 * @example
 * ```typescript
 * import { UserResponse } from '../types/user.types';
 * ```
 */

export interface UserPayload {
  sub: string;
  email: string;
}

export interface RequestUser {
  id: string;
  email: string;
}

export type UserWithVerification = User;
