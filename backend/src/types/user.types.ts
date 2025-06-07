export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  emailVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
}

export interface UserPayload {
  sub: string;
  email: string;
}

export type UserWithVerification = User;
