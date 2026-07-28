import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
  status: z.enum(["ACTIVE", "DISABLED"]),
  name: z.string().nullable(),
  pictureUrl: z.string().url().nullable(),
  emailVerified: z.boolean(),
  lastLoginAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const authUserResponseSchema = z.object({
  user: userSchema,
});

export const signOutResultSchema = z.object({
  signedOut: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createUserSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
});
