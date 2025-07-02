import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
});
export type AuthState = z.infer<typeof AuthStateSchema>;
